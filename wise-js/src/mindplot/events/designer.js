/* global define */
'use strict';

define(['assert', 'mindplot/events'], ($assert, Events) => {
    class Designer extends Events {
        get mindmap() {
            return this._mindmap;
        }

        get model() {
            return this._model;
        }

        get workspace() {
            return this._workspace;
        }

        /**
         * @constructs
         * @param {Object} options
         * @param {HTMLElement} divElement
         * @extends mindplot.Events
         */
        constructor(options, divElement) {
            super();

            $assert(options, "options must be defined");
            $assert(options.zoom, "zoom must be defined");
            $assert(options.size, "size must be defined");
            $assert(divElement, "divElement must be defined");

            // Set up i18n location ...
            mindplot.Messages.init(options.locale);

            this._options = options;

            // Set full div elem render area ...
            divElement.css(options.size);

            // Dispatcher manager ...
            let commandContext = new mindplot.CommandContext(this);
            this._actionDispatcher = new mindplot.StandaloneActionDispatcher(commandContext);

            this._actionDispatcher.addEvent('modelUpdate', (event) => {
                this.fireEvent('modelUpdate', event);
            });

            mindplot.ActionDispatcher.setInstance(this._actionDispatcher);
            this._model = new mindplot.DesignerModel(options);

            // Init Screen manager..
            let screenManager = new mindplot.ScreenManager(divElement);
            this._workspace = new mindplot.Workspace(screenManager, this._model.getZoom());

            // Init layout manager ...
            this._eventBussDispatcher = new mindplot.layout.EventBusDispatcher(this.model);

            // Register events
            if (!this.isReadOnly()) {
                // Register mouse events ...
                this._registerMouseEvents();

                // Register keyboard events ...
                mindplot.DesignerKeyboard.register(this);

                this._dragManager = this._buildDragManager(this._workspace);
            }
            this._registerWheelEvents();

            this._relPivot = new mindplot.RelationshipPivot(this._workspace, this);

            // Set editor working area ...
            this.setViewPort(options.viewPort);

            mindplot.TopicEventDispatcher.configure(this.isReadOnly());
            this._clipboard = [];
        }

        /**
         * @private
         */
        _registerWheelEvents() {
            let zoomFactor = 1.006;
            // Zoom In and Zoom Out must active event
            $(document).on('mousewheel', (event) => {
                if (event.deltaY > 0) {
                    this.zoomIn(zoomFactor);
                } else {
                    this.zoomOut(zoomFactor);
                }
                event.preventDefault();
            });
        }

        /**
         * @param {String} type the event type
         * @param {Function} listener
         * forwards to the TopicEventDispatcher or the parent Events class, depending on the type
         */
        addEvent(type, listener) {
            if (type == mindplot.TopicEvent.EDIT || type == mindplot.TopicEvent.CLICK) {
                let editor = mindplot.TopicEventDispatcher.getInstance();
                editor.addEvent(type, listener);
            } else {
                super.addEvent(type, listener);
            }
        }

        /**
         * @private
         */
        _registerMouseEvents() {
            let workspace = this._workspace;
            let screenManager = workspace.getScreenManager();
            // Initialize workspace event listeners.
            screenManager.addEvent('update', () => {
                // Topic must be set to his original state. All editors must be closed.
                let topics = this.model.getTopics();
                _.each(topics, (object) => {
                    object.closeEditors();
                });

                // Clean some selected nodes on event ..
                if (this._cleanScreen) {
                    this._cleanScreen();
                }
            });

            // Deselect on click ...
            screenManager.addEvent('click', (event) => {
                this.onObjectFocusEvent(null, event);
            });

            // Create nodes on double click...
            screenManager.addEvent('dblclick', (event) => {
                if (workspace.isWorkspaceEventsEnabled()) {
                    let mousePos = screenManager.getWorkspaceMousePosition(event);
                    let centralTopic = this.model.getCentralTopic();
                    let model = this._createChildModel(centralTopic, mousePos);
                    this._actionDispatcher.addTopics([model], [centralTopic.getId()]);
                }
            });

            // Register mouse drag and drop event ...
            function noopHandler(evt) {
                evt.stopPropagation();
                evt.preventDefault();
            }
        }

        /**
         * @private
         * @param {mindplot.Workspace} workspace
         * @return {mindplot.DragManager} the new dragManager for the workspace with events
         * registered
         */
        _buildDragManager(workspace) {
            let designerModel = this.model;
            let dragConnector = new mindplot.DragConnector(designerModel, this._workspace);
            let dragManager = new mindplot.DragManager(workspace, this._eventBussDispatcher);
            let topics = designerModel.getTopics();

            dragManager.addEvent('startdragging', () => {
                // Enable all mouse events.
                for (let i = 0; i < topics.length; i++) {
                    topics[i].setMouseEventsEnabled(false);
                }
            });

            dragManager.addEvent('dragging', (event, dragTopic) => {
                dragTopic.updateFreeLayout(event);
                if (!dragTopic.isFreeLayoutOn(event)) {
                    // The node is being drag. Is the connection still valid ?
                    dragConnector.checkConnection(dragTopic);

                    if (!dragTopic.isVisible() && dragTopic.isConnected()) {
                        dragTopic.setVisibility(true);
                    }
                }
            });

            dragManager.addEvent('enddragging', (event, dragTopic) => {
                for (let i = 0; i < topics.length; i++) {
                    topics[i].setMouseEventsEnabled(true);
                }
                dragTopic.applyChanges(workspace);
            });

            return dragManager;
        }

        /**
         * @param {{width:Number, height:Number}} size
         * sets width and height of the workspace
         */
        setViewPort(size) {
            this._workspace.setViewPort(size);
            let model = this.model;
            this._workspace.setZoom(model.getZoom(), true);
        }

        /**
         * @private
         * @param {mindplot.model.NodeModel} model
         * @param {Boolean} readOnly
         * @return {mindplot.CentralTopic|mindplot.MainTopic} the topic to the given model,
         * connected, added to the drag manager, with events registered - complying type & read mode
         */
        _buildNodeGraph(model, readOnly) {
            // Create node graph ...
            let topic = mindplot.NodeGraph.create(model, {'readOnly': readOnly});
            this.model.addTopic(topic);
            // Add Topic events ...
            if (!readOnly) {
                // If a node had gained focus, clean the rest of the nodes ...
                topic.addEvent('mousedown', (event) => {
                    this.onObjectFocusEvent(topic, event);
                });

                // Register node listeners ...
                if (topic.getType() != mindplot.model.INodeModel.CENTRAL_TOPIC_TYPE) {
                    // Central Topic doesn't support to be dragged
                    this._dragManager.add(topic);
                }
            }

            // Connect Topic ...
            let isConnected = model.isConnected();
            if (isConnected) {
                // Improve this ...
                let targetTopicModel = model.getParent();
                let targetTopic = null;

                let topics = this.model.getTopics();
                for (let i = 0; i < topics.length; i++) {
                    let t = topics[i];
                    if (t.getModel() == targetTopicModel) {
                        targetTopic = t;
                        // Disconnect the node. It will be connected again later ...
                        model.disconnect();
                        break;
                    }
                }
                $assert(targetTopic, "Could not find a topic to connect");
                topic.connectTo(targetTopic, this._workspace);
            }

            topic.addEvent('ontblur', () => {
                let topics = this.model.filterSelectedTopics();
                let rels = this.model.filterSelectedRelationships();

                if (topics.length == 0 || rels.length == 0) {
                    this.fireEvent('onblur');
                }
            });

            topic.addEvent('ontfocus', () => {
                let topics = this.model.filterSelectedTopics();
                let rels = this.model.filterSelectedRelationships();

                if (topics.length == 1 || rels.length == 1) {
                    this.fireEvent('onfocus');
                }
            });

            return topic;
        }

        /**
         * @param {?mindplot.Topic} currentObject
         * @param {Event=} event
         * sets focus to the given currentObject and removes it from any other objects if not
         * triggered with Ctrl pressed
         */
        onObjectFocusEvent(currentObject, event) {
            // Close node editors ..
            let topics = this.model.getTopics();
            _.each(topics, (topic) => {
                topic.closeEditors();
            });

            let model = this.model;
            let objects = model.getEntities();
            _.each(objects, (object) => {
                // Disable all nodes on focus but not the current if Ctrl key isn't being pressed
                if (!$defined(event) || (!event.ctrlKey && !event.metaKey)) {
                    if (object.isOnFocus() && object != currentObject) {
                        object.setOnFocus(false);
                    }
                }
            });

        }

        /**
         * sets focus to all model entities, i.e. relationships and topics
         */
        selectAll() {
            let model = this.model;
            let objects = model.getEntities();
            _.each(objects, (object) => {
                object.setOnFocus(true);
            });
        }

        /**
         * removes focus from all model entities, i.e. relationships and topics
         */
        deselectAll() {
            let objects = this.model.getEntities();
            _.each(objects, (object) => {
                object.setOnFocus(false);
            });
        }

        /**
         * Set the zoom of the map
         * @param {Number} zoom number between 0.3 and 1.9
         */
        setZoom(zoom) {
            if (zoom > 1.9 || zoom < 0.3) {
                $notify($msg('ZOOM_IN_ERROR'));
                return;
            }
            this.model.setZoom(zoom);
            this._workspace.setZoom(zoom);
        }

        /**
         * @param {Number=} factor
         * zoom out by the given factor, or 1.2, if undefined
         */
        zoomOut(factor) {
            if (!factor) {
                factor = 1.2;
            }

            let model = this.model;
            let scale = model.getZoom() * factor;
            if (scale <= 1.9) {
                model.setZoom(scale);
                this._workspace.setZoom(scale);
            } else {
                $notify($msg('ZOOM_ERROR'));
            }

        }

        /**
         * @param {Number=} factor
         * zoom in by the given factor, or 1.2, if undefined
         */
        zoomIn(factor) {
            if (!factor) {
                factor = 1.2;
            }

            let model = this.model;
            let scale = model.getZoom() / factor;

            if (scale >= 0.3) {
                model.setZoom(scale);
                this._workspace.setZoom(scale);
            } else {
                $notify($msg('ZOOM_ERROR'));
            }
        }

        /**
         * copy selected topics to a private clipboard
         */
        copyToClipboard() {
            let topics = this.model.filterSelectedTopics();
            if (topics.length <= 0) {
                // If there are more than one node selected,
                $notify($msg('AT_LEAST_ONE_TOPIC_MUST_BE_SELECTED'));
                return;
            }

            // Exclude central topic ..
            topics = topics.filter((topic) => {
                return !topic.isCentralTopic();
            });

            this._clipboard = topics.map((topic) => {
                let nodeModel = topic.getModel().deepCopy();

                // Change position to make the new topic evident...
                let pos = nodeModel.getPosition();
                nodeModel.setPosition(pos.x + (60 * Math.sign(pos.x)), pos.y + 30);

                return nodeModel;
            });

            $notify($msg('SELECTION_COPIED_TO_CLIPBOARD'));
        }

        /**
         * paste clipboard contents to the mindmap
         */
        pasteClipboard() {
            if (this._clipboard.length == 0) {
                $notify($msg('CLIPBOARD_IS_EMPTY'));
                return;
            }
            this._actionDispatcher.addTopics(this._clipboard);
            this._clipboard = [];
        }

        /**
         * collapse the subtree of the selected topic
         */
        shrinkSelectedBranch() {
            let nodes = this.model.filterSelectedTopics();
            if (nodes.length <= 0 || nodes.length != 1) {
                // If there are more than one node selected,
                $notify($msg('ONLY_ONE_TOPIC_MUST_BE_SELECTED_COLLAPSE'));
                return;
            }
            // Execute event ...
            let topic = nodes[0];
            if (topic.getType() != mindplot.model.INodeModel.CENTRAL_TOPIC_TYPE) {
                this._actionDispatcher.shrinkBranch([topic.getId()], !topic.areChildrenShrunken());
            }
        }

        /**
         * create a NodeModel for the selected node's child and add it via the ActionDispatcher
         */
        createChildForSelectedNode() {
            let nodes = this.model.filterSelectedTopics();
            if (nodes.length <= 0) {
                // If there are more than one node selected,
                $notify($msg('ONE_TOPIC_MUST_BE_SELECTED'));
                return;
            }
            if (nodes.length != 1) {
                // If there are more than one node selected,
                $notify($msg('ONLY_ONE_TOPIC_MUST_BE_SELECTED'));
                return;
            }

            // Add new node ...
            let parentTopic = nodes[0];
            let parentTopicId = parentTopic.getId();
            let childModel = this._createChildModel(parentTopic);

            // Execute event ...
            this._actionDispatcher.addTopics([childModel], [parentTopicId]);
        }

        /**
         * @private
         */
        _copyNodeProps(sourceModel, targetModel) {
            // I don't copy the font size if the target is the source is the central topic.
            if (sourceModel.getType() != mindplot.model.INodeModel.CENTRAL_TOPIC_TYPE) {
                let fontSize = sourceModel.getFontSize();
                if (fontSize) {
                    targetModel.setFontSize(fontSize)
                }
            }

            let fontFamily = sourceModel.getFontFamily();
            if (fontFamily) {
                targetModel.setFontFamily(fontFamily)
            }

            let fontColor = sourceModel.getFontColor();
            if (fontColor) {
                targetModel.setFontColor(fontColor)
            }

            let fontWeight = sourceModel.getFontWeight();
            if (fontWeight) {
                targetModel.setFontWeight(fontWeight)
            }

            let fontStyle = sourceModel.getFontStyle();
            if (fontStyle) {
                targetModel.setFontStyle(fontStyle)
            }

            let shape = sourceModel.getShapeType();
            if (shape) {
                targetModel.setShapeType(shape)
            }

            let borderColor = sourceModel.getBorderColor();
            if (borderColor) {
                targetModel.setBorderColor(borderColor)
            }

            let backgroundColor = sourceModel.getBackgroundColor();
            if (backgroundColor) {
                targetModel.setBackgroundColor(backgroundColor)
            }
        }

        /**
         * @private
         * @param {mindplot.Topic} topic the parent topic of the child to create the NodeModel for
         * @param {core.Point} mousePos the mouse position
         * @return {mindplot.NodeModel} the node model for the new child
         */
        _createChildModel(topic, mousePos) {
            // Create a new node ...
            let parentModel = topic.getModel();
            let mindmap = parentModel.getMindmap();
            let childModel = mindmap.createNode();

            // Create a new node ...
            let layoutManager = this._eventBussDispatcher.getLayoutManager();
            let result = layoutManager.predict(topic.getId(), null, mousePos);
            childModel.setOrder(result.order);

            let position = result.position;
            childModel.setPosition(position.x, position.y);

            this._copyNodeProps(parentModel, childModel);

            return childModel;
        }

        /**
         * @param {Events} event
         * @param {mindplot.model.NodeModel} model
         * @todo not used
         */
        addDraggedNode(event, model) {
            $assert(event, "event can not be null");
            $assert(model, "model can not be null");

            // Position far from the visual area ...
            model.setPosition(1000, 1000);

            this._actionDispatcher.addTopics([model]);
            let topic = this.model.findTopicById(model.getId());

            // Simulate a mouse down event to start the dragging ...
            topic.fireEvent("mousedown", event);
        }

        /**
         * creates a sibling or child node of the selected node, if the selected node is the
         * central topic
         */
        createSiblingForSelectedNode() {
            let nodes = this.model.filterSelectedTopics();
            if (nodes.length <= 0) {
                // If there are no nodes selected,
                $notify($msg('ONE_TOPIC_MUST_BE_SELECTED'));
                return;

            }
            if (nodes.length > 1) {
                // If there are more than one node selected,
                $notify($msg('ONLY_ONE_TOPIC_MUST_BE_SELECTED'));
                return;
            }

            let topic = nodes[0];
            if (!topic.getOutgoingConnectedTopic()) { // Central topic and isolated topics ....
                // Central topic doesn't have siblings ...
                this.createChildForSelectedNode();

            } else {
                let parentTopic = topic.getOutgoingConnectedTopic();
                let siblingModel = this._createSiblingModel(topic);

                // Hack: if parent is central topic, add node below not on opposite side.
                // This should be done in the layout
                if (parentTopic.getType() == mindplot.model.INodeModel.CENTRAL_TOPIC_TYPE) {
                    siblingModel.setOrder(topic.getOrder() + 2);
                }

                let parentTopicId = parentTopic.getId();
                this._actionDispatcher.addTopics([siblingModel], [parentTopicId]);
            }
        }

        /**
         * @private
         * @param {mindplot.Topic} topic the topic to create the sibling to
         * @return {mindplot.NodeModel} the node model of the sibling
         */
        _createSiblingModel(topic) {
            let result = null;
            let parentTopic = topic.getOutgoingConnectedTopic();
            if (parentTopic != null) {
                // Create a new node ...
                let model = topic.getModel();
                let mindmap = model.getMindmap();
                result = mindmap.createNode();

                // Create a new node ...
                let order = topic.getOrder() + 1;
                result.setOrder(order);
                result.setPosition(10, 10);  // Set a dummy position ...
            }

            this._copyNodeProps(model, result);

            return result;
        }

        /**
         * @param {Event} event
         */
        showRelPivot(event) {
            let nodes = this.model.filterSelectedTopics();
            if (nodes.length <= 0) {
                // This could not happen ...
                $notify($msg('RELATIONSHIP_COULD_NOT_BE_CREATED'));
                return;
            }

            // Current mouse position ....
            let screen = this._workspace.getScreenManager();
            let pos = screen.getWorkspaceMousePosition(event);

            // create a connection ...
            this._relPivot.start(nodes[0], pos);
        }

        /** @return {{zoom:Number}} the zoom */
        getMindmapProperties() {
            let model = this.model;
            return {zoom: model.getZoom()};
        }

        /**
         * @param {mindplot.Mindmap} mindmapModel
         * @throws will throw an error if mindmapModel is null or undefined
         */
        loadMap(mindmapModel) {
            $assert(mindmapModel, "mindmapModel can not be null");
            this._mindmap = mindmapModel;

            // Init layout manager ...
            let size = {width: 25, height: 25};
            let layoutManager = new mindplot.layout.LayoutManager(mindmapModel.getCentralTopic().getId(), size);
            layoutManager.addEvent('change', (event) => {
                let id = event.getId();
                let topic = this.model.findTopicById(id);
                topic.setPosition(event.getPosition());
                topic.setOrder(event.getOrder());
            });
            this._eventBussDispatcher.setLayoutManager(layoutManager);

            // Building node graph ...
            let branches = mindmapModel.getBranches();
            for (let i = 0; i < branches.length; i++) {
                // NodeModel -> NodeGraph ...
                let nodeModel = branches[i];
                let nodeGraph = this.nodeModelToNodeGraph(nodeModel);

                // Update shrink render state...
                nodeGraph.setBranchVisibility(true);
            }

            let relationships = mindmapModel.getRelationships();
            for (let j = 0; j < relationships.length; j++) {
                this._relationshipModelToRelationship(relationships[j]);
            }

            // Place the focus on the Central Topic
            let centralTopic = this.model.getCentralTopic();
            this.goToNode(centralTopic);

            // Finally, sort the map ...
            mindplot.EventBus.instance.fireEvent(mindplot.EventBus.events.DoLayout);

            this.fireEvent('loadSuccess');
        }

        undo() {
            // @Todo: This is a hack...
            this._actionDispatcher._actionRunner.undo();
        }

        redo() {
            this._actionDispatcher._actionRunner.redo();
        }

        isReadOnly() {
            return this._options.readOnly;
        }

        /**
         * @param {mindplot.model.NodeModel} nodeModel
         * @return {mindplot.Topic} the topic (extends mindplot.NodeGraph) created to the model
         */
        nodeModelToNodeGraph(nodeModel) {
            $assert(nodeModel, "Node model can not be null");
            let children = nodeModel.getChildren().slice();
            children = children.sort((a, b) => {
                return a.getOrder() - b.getOrder()
            });

            let nodeGraph = this._buildNodeGraph(nodeModel, this.isReadOnly());
            nodeGraph.setVisibility(false);

            this._workspace.append(nodeGraph);
            for (let i = 0; i < children.length; i++) {
                let child = children[i];
                if ($defined(child)) {
                    this.nodeModelToNodeGraph(child);
                }
            }

            return nodeGraph;
        }

        /**
         * @private
         * @param {mindplot.model.RelationshipModel} model
         * @return {mindplot.Relationship} the relationship created to the model
         * @throws will throw an error if model is null or undefined
         */
        _relationshipModelToRelationship(model) {
            $assert(model, "Node model can not be null");

            let result = this._buildRelationshipShape(model);

            let sourceTopic = result.getSourceTopic();
            sourceTopic.addRelationship(result);

            let targetTopic = result.getTargetTopic();
            targetTopic.addRelationship(result);

            result.setVisibility(sourceTopic.isVisible() && targetTopic.isVisible());

            this._workspace.append(result);
            return result;
        }

        /**
         * @param {mindplot.model.RelationshipModel} model
         * @return {mindplot.Relationship} the relationship added to the mindmap
         */
        addRelationship(model) {
            this.mindmap.addRelationship(model);
            return this._relationshipModelToRelationship(model);
        }

        /**
         * deletes the relationship from the linked topics, DesignerModel, Workspace and Mindmap
         * @param {mindplot.Relationship} rel the relationship to delete
         */
        deleteRelationship(rel) {
            let sourceTopic = rel.getSourceTopic();
            sourceTopic.deleteRelationship(rel);

            let targetTopic = rel.getTargetTopic();
            targetTopic.deleteRelationship(rel);

            this.model.removeRelationship(rel);
            this._workspace.removeChild(rel);

            this.mindmap.deleteRelationship(rel.getModel());
        }

        /**
         * @private
         * @param {mindplot.model.RelationshipModel} model
         * @return {mindplot.Relationship} the new relationship with events registered
         * @throws will throw an error if the target topic cannot be found
         */
        _buildRelationshipShape(model) {
            let dmodel = this.model;

            let sourceTopicId = model.getFromNode();
            let sourceTopic = dmodel.findTopicById(sourceTopicId);

            let targetTopicId = model.getToNode();
            let targetTopic = dmodel.findTopicById(targetTopicId);
            $assert(targetTopic, "targetTopic could not be found:" + targetTopicId + dmodel.getTopics().map((e) => {return e.getId();}));

            // Build relationship line ....
            let result = new mindplot.Relationship(sourceTopic, targetTopic, model);
            result.addEvent('ontblur', () => {
                let topics = this.model.filterSelectedTopics();
                let rels = this.model.filterSelectedRelationships();

                if (topics.length == 0 || rels.length == 0) {
                    this.fireEvent('onblur');
                }
            });

            result.addEvent('ontfocus', () => {
                let topics = this.model.filterSelectedTopics();
                let rels = this.model.filterSelectedRelationships();

                if (topics.length == 1 || rels.length == 1) {
                    this.fireEvent('onfocus');
                }
            });

            // Append it to the workspace ...
            dmodel.addRelationship(result);

            return result;
        }

        /**
         * @param {mindplot.Topic} node the topic to remove
         * removes the given topic and its children from Workspace, DesignerModel and NodeModel
         */
        removeTopic(node) {
            if (!node.isCentralTopic()) {
                let parent = node._parent;
                node.disconnect(this._workspace);

                //remove children
                while (node.getChildren().length > 0) {
                    this.removeTopic(node.getChildren()[0]);
                }

                this._workspace.removeChild(node);
                this.model.removeTopic(node);

                // Delete this node from the model...
                let model = node.getModel();
                model.deleteNode();

                if ($defined(parent)) {
                    this.goToNode(parent);
                }
            }
        }

        /**
         * @private
         */
        _resetEdition() {
            let screenManager = this._workspace.getScreenManager();
            screenManager.fireEvent("update");
            screenManager.fireEvent("mouseup");
            this._relPivot.dispose();
        }

        deleteSelectedEntities() {
            // Is there some action in progress ?.
            this._resetEdition();

            let topics = this.model.filterSelectedTopics();
            let relation = this.model.filterSelectedRelationships();
            if (topics.length <= 0 && relation.length <= 0) {
                // If there are more than one node selected,
                $notify($msg('ENTITIES_COULD_NOT_BE_DELETED'));
                return;
            } else if (topics.length == 1 && topics[0].isCentralTopic()) {
                $notify($msg('CENTRAL_TOPIC_CAN_NOT_BE_DELETED'));
                return;
            }

            // If the central topic has been selected, I must filter ir
            let topicIds = topics.filter((topic) => {
                return !topic.isCentralTopic();
            }).map((topic) => {
                return topic.getId()
            });


            let relIds = relation.map((rel) => {
                return rel.getId();
            });

            // Finally delete the topics ...
            if (topicIds.length > 0 || relIds.length > 0) {
                this._actionDispatcher.deleteEntities(topicIds, relIds);
            }
        }

        changeFontFamily(font) {
            let topicsIds = this.model.filterTopicsIds();
            if (topicsIds.length > 0) {
                this._actionDispatcher.changeFontFamilyToTopic(topicsIds, font);
            }
        }

        changeFontStyle() {
            let topicsIds = this.model.filterTopicsIds();
            if (topicsIds.length > 0) {
                this._actionDispatcher.changeFontStyleToTopic(topicsIds);
            }
        }

        changeFontColor(color) {
            $assert(color, "color can not be null");

            let topicsIds = this.model.filterTopicsIds();
            if (topicsIds.length > 0) {
                this._actionDispatcher.changeFontColorToTopic(topicsIds, color);
            }
        }

        changeBackgroundColor(color) {
            let validateFunc = (topic) => {
                return topic.getShapeType() != mindplot.model.TopicShape.LINE;
            };
            let validateError = 'Color can not be set to line topics.';

            let topicsIds = this.model.filterTopicsIds(validateFunc, validateError);
            if (topicsIds.length > 0) {
                this._actionDispatcher.changeBackgroundColorToTopic(topicsIds, color);
            }
        }

        changeBorderColor(color) {
            let validateFunc = (topic) => {
                return topic.getShapeType() != mindplot.model.TopicShape.LINE;
            };
            let validateError = 'Color can not be set to line topics.';
            let topicsIds = this.model.filterTopicsIds(validateFunc, validateError);
            if (topicsIds.length > 0) {
                this._actionDispatcher.changeBorderColorToTopic(topicsIds, color);
            }
        }

        changeFontSize(size) {
            let topicsIds = this.model.filterTopicsIds();
            if (topicsIds.length > 0) {
                this._actionDispatcher.changeFontSizeToTopic(topicsIds, size);
            }
        }

        changeTopicShape(shape) {
            let validateFunc = (topic) => {
                return !(topic.getType() == mindplot.model.INodeModel.CENTRAL_TOPIC_TYPE && shape == mindplot.model.TopicShape.LINE)
            };

            let validateError = 'Central Topic shape can not be changed to line figure.';
            let topicsIds = this.model.filterTopicsIds(validateFunc, validateError);
            if (topicsIds.length > 0) {
                this._actionDispatcher.changeShapeTypeToTopic(topicsIds, shape);
            }
        }

        changeFontWeight() {
            let topicsIds = this.model.filterTopicsIds();
            if (topicsIds.length > 0) {
                this._actionDispatcher.changeFontWeightToTopic(topicsIds);
            }
        }

        addIconType(iconType) {
            let topicsIds = this.model.filterTopicsIds();
            if (topicsIds.length > 0) {
                this._actionDispatcher.addFeatureToTopic(topicsIds[0], mindplot.TopicFeature.Icon.id, {'id': iconType});
            }
        }

        /**
         * lets the selected topic open the link editor where the user can define or modify an
         * existing link
         */
        addLink() {
            let topic = this.model.selectedTopic();
            if (topic) {
                topic.showLinkEditor();
                this.onObjectFocusEvent();
            }
        }

        addNote() {
            let topic = this.model.selectedTopic();
            if (topic) {
                topic.showNoteEditor();
                this.onObjectFocusEvent();
            }
        }

        /**
         * @param {mindplot.Topic} node
         * sets the focus to the given node
         */
        goToNode(node) {
            node.setOnFocus(true);
            this.onObjectFocusEvent(node);
        }
    }

    return Designer;
});
