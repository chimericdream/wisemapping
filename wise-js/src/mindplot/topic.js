/* global define */
'use strict';

define(['utils/assert'], ($assert) => {
    class Topic extends NodeGraph {
        /**
         * @extends mindplot.NodeGraph
         * @constructs
         * @param model
         * @param options
         */
        constructor(model, options) {
            this.parent(model, options);
            this._children = [];
            this._parent = null;
            this._relationships = [];
            this._isInWorkspace = false;
            this._buildTopicShape();

            // Position a topic ....
            let pos = model.getPosition();
            if (pos != null && this.isCentralTopic()) {
                this.setPosition(pos);
            }

            // Register events for the topic ...
            if (!this.isReadOnly()) {
                this._registerEvents();
            }
        }

        _registerEvents() {
            this.setMouseEventsEnabled(true);

            // Prevent click on the topics being propagated ...
            this.addEvent('click', function(event) {
                event.stopPropagation();
            });
            let me = this;
            this.addEvent('dblclick', function(event) {
                me._getTopicEventDispatcher().show(me);
                event.stopPropagation();
            });
        }

        /**
         * @param {String} type the topic shape type
         * @see {@link mindplot.model.INodeModel}
         */
        setShapeType(type) {
            this._setShapeType(type, true);
        }

        /** @return {mindplot.Topic} parent topic */
        getParent() {
            return this._parent;
        }

        _setShapeType(type, updateModel) {
            // Remove inner shape figure ...
            let model = this.getModel();
            if ($defined(updateModel) && updateModel) {
                model.setShapeType(type);
            }

            let oldInnerShape = this.getInnerShape();
            if (oldInnerShape != null) {
                this._removeInnerShape();

                // Create a new one ...
                let innerShape = this.getInnerShape();

                // Update figure size ...
                let size = this.getSize();
                this.setSize(size, true);

                let group = this.get2DElement();
                group.append(innerShape);

                // Move text to the front ...
                let text = this.getTextShape();
                text.moveToFront();

                //Move iconGroup to front ...
                let iconGroup = this.getIconGroup();
                if ($defined(iconGroup)) {
                    iconGroup.moveToFront();
                }

                //Move connector to front
                let connector = this.getShrinkConnector();
                if ($defined(connector)) {
                    connector.moveToFront();
                }
            }
        }

        /** @return {String} topic shape type */
        getShapeType() {
            let model = this.getModel();
            let result = model.getShapeType();
            if (!$defined(result)) {
                result = mindplot.TopicStyle.defaultShapeType(this);
            }
            return result;
        }

        _removeInnerShape() {
            let group = this.get2DElement();
            let innerShape = this.getInnerShape();
            group.removeChild(innerShape);
            this._innerShape = null;
            return innerShape;
        }

        /** @return {web2d.Line|web2d.Rect|web2d.Image} inner shape of the topic */
        getInnerShape() {
            if (!$defined(this._innerShape)) {
                // Create inner box.
                this._innerShape = this._buildShape(mindplot.Topic.INNER_RECT_ATTRIBUTES, this.getShapeType());

                // Update bgcolor ...
                let bgColor = this.getBackgroundColor();
                this._setBackgroundColor(bgColor, false);

                // Update border color ...
                let brColor = this.getBorderColor();
                this._setBorderColor(brColor, false);

                // Define the pointer ...
                if (!this.isCentralTopic() && !this.isReadOnly()) {
                    this._innerShape.setCursor('move');
                } else {
                    this._innerShape.setCursor('default');
                }
            }
            return this._innerShape;
        }

        _buildShape(attributes, shapeType) {
            $assert(attributes, 'attributes can not be null');
            $assert(shapeType, 'shapeType can not be null');

            let result;
            if (shapeType == mindplot.model.TopicShape.RECTANGLE) {
                result = new web2d.Rect(0, attributes);
            } else if (shapeType == mindplot.model.TopicShape.IMAGE) {
                let model = this.getModel();
                let url = model.getImageUrl();
                let size = model.getImageSize();

                result = new web2d.Image();
                result.setHref(url);
                result.setSize(size.width, size.height);

                result.getSize = function() {
                    return model.getImageSize();
                };

                result.setPosition = function() {
                };
            } else if (shapeType == mindplot.model.TopicShape.ELLIPSE) {
                result = new web2d.Rect(0.9, attributes);
            } else if (shapeType == mindplot.model.TopicShape.ROUNDED_RECT) {
                result = new web2d.Rect(0.3, attributes);
            } else if (shapeType == mindplot.model.TopicShape.LINE) {
                result = new web2d.Line({strokeColor: '#495879', strokeWidth: 1});
                result.setSize = function(width, height) {
                    this.size = {width: width, height: height};
                    result.setFrom(0, height);
                    result.setTo(width, height);

                    // Lines will have the same color of the default connection lines...
                    let stokeColor = mindplot.ConnectionLine.getStrokeColor();
                    result.setStroke(1, 'solid', stokeColor);
                };

                result.getSize = function() {
                    return this.size;
                };

                result.setPosition = function() {};
                result.setFill = function() {};
                result.setStroke = function() {};
            } else {
                $assert(false, 'Unsupported figure shapeType:' + shapeType);
            }
            result.setPosition(0, 0);
            return result;
        }

        /** @param {String} type the cursor type, either 'pointer', 'default' or 'move' */
        setCursor(type) {
            let innerShape = this.getInnerShape();
            innerShape.setCursor(type);

            let outerShape = this.getOuterShape();
            outerShape.setCursor(type);

            let textShape = this.getTextShape();
            textShape.setCursor(type);
        }

        /** @return outer shape */
        getOuterShape() {
            if (!$defined(this._outerShape)) {
                let rect = this._buildShape(mindplot.Topic.OUTER_SHAPE_ATTRIBUTES, mindplot.model.TopicShape.ROUNDED_RECT);
                rect.setPosition(-2, -3);
                rect.setOpacity(0);
                this._outerShape = rect;
            }

            return this._outerShape;
        }

        /** @return text shape */
        getTextShape() {
            if (!$defined(this._text)) {
                this._text = this._buildTextShape(false);

                // Set Text ...
                let text = this.getText();
                this._setText(text, false);
            }

            return this._text;
        }

        /** @return icon group */
        getOrBuildIconGroup() {
            if (!$defined(this._iconsGroup)) {
                this._iconsGroup = this._buildIconGroup();
                let group = this.get2DElement();
                group.append(this._iconsGroup.getNativeElement());
                this._iconsGroup.moveToFront();
            }
            return this._iconsGroup;
        }

        /** */
        getIconGroup() {
            return this._iconsGroup;
        }

        _buildIconGroup() {
            let textHeight = this.getTextShape().getFontHeight();
            let result = new mindplot.IconGroup(this.getId(), textHeight);
            let padding = mindplot.TopicStyle.getInnerPadding(this);
            result.setPosition(padding, padding);

            // Load topic features ...
            let model = this.getModel();
            let featuresModel = model.getFeatures();
            for (let i = 0; i < featuresModel.length; i++) {
                let featureModel = featuresModel[i];
                let icon = mindplot.TopicFeature.createIcon(this, featureModel, this.isReadOnly());
                result.addIcon(icon, featureModel.getType() == mindplot.TopicFeature.Icon.id && !this.isReadOnly());
            }

            return result;
        }

        /**
         * assigns the new feature model to the topic's node model and adds the respective icon
         * @param {mindplot.model.FeatureModel} featureModel
         * @return {mindplot.Icon} the icon corresponding to the feature model
         */
        addFeature(featureModel) {
            let iconGroup = this.getOrBuildIconGroup();
            this.closeEditors();

            // Update model ...
            let model = this.getModel();
            model.addFeature(featureModel);

            let result = mindplot.TopicFeature.createIcon(this, featureModel, this.isReadOnly());
            iconGroup.addIcon(result, featureModel.getType() == mindplot.TopicFeature.Icon.id && !this.isReadOnly());

            this._adjustShapes();
            return result;
        }

        /** */
        findFeatureById(id) {
            let model = this.getModel();
            return model.findFeatureById(id);
        }

        /** */
        removeFeature(featureModel) {
            $assert(featureModel, 'featureModel could not be null');

            //Removing the icon from MODEL
            let model = this.getModel();
            model.removeFeature(featureModel);

            //Removing the icon from UI
            let iconGroup = this.getIconGroup();
            if ($defined(iconGroup)) {
                iconGroup.removeIconByModel(featureModel);
            }
            this._adjustShapes();
        }

        /** */
        addRelationship(relationship) {
            this._relationships.push(relationship);
        }

        /** */
        deleteRelationship(relationship) {
            this._relationships.erase(relationship);
        }

        /** */
        getRelationships() {
            return this._relationships;
        }

        _buildTextShape(readOnly) {
            let result = new web2d.Text();
            let family = this.getFontFamily();
            let size = this.getFontSize();
            let weight = this.getFontWeight();
            let style = this.getFontStyle();
            result.setFont(family, size, style, weight);

            let color = this.getFontColor();
            result.setColor(color);

            if (!readOnly) {
                // Propagate mouse events ...
                if (!this.isCentralTopic()) {
                    result.setCursor('move');
                } else {
                    result.setCursor('default');
                }
            }

            return result;
        }

        /** */
        setFontFamily(value, updateModel) {
            let textShape = this.getTextShape();
            textShape.setFontFamily(value);
            if ($defined(updateModel) && updateModel) {
                let model = this.getModel();
                model.setFontFamily(value);
            }
            this._adjustShapes(updateModel);
        }

        /** */
        setFontSize(value, updateModel) {
            let textShape = this.getTextShape();
            textShape.setSize(value);

            if ($defined(updateModel) && updateModel) {
                let model = this.getModel();
                model.setFontSize(value);
            }
            this._adjustShapes(updateModel);
        }

        /** */
        setFontStyle(value, updateModel) {
            let textShape = this.getTextShape();
            textShape.setStyle(value);
            if ($defined(updateModel) && updateModel) {
                let model = this.getModel();
                model.setFontStyle(value);
            }
            this._adjustShapes(updateModel);
        }

        /** */
        setFontWeight(value, updateModel) {
            let textShape = this.getTextShape();
            textShape.setWeight(value);
            if ($defined(updateModel) && updateModel) {
                let model = this.getModel();
                model.setFontWeight(value);
            }
            this._adjustShapes();
        }

        /** */
        getFontWeight() {
            let model = this.getModel();
            let result = model.getFontWeight();
            if (!$defined(result)) {
                let font = mindplot.TopicStyle.defaultFontStyle(this);
                result = font.weight;
            }
            return result;
        }

        /** */
        getFontFamily() {
            let model = this.getModel();
            let result = model.getFontFamily();
            if (!$defined(result)) {
                let font = mindplot.TopicStyle.defaultFontStyle(this);
                result = font.font;
            }
            return result;
        }

        /** */
        getFontColor() {
            let model = this.getModel();
            let result = model.getFontColor();
            if (!$defined(result)) {
                let font = mindplot.TopicStyle.defaultFontStyle(this);
                result = font.color;
            }
            return result;
        }

        /** */
        getFontStyle() {
            let model = this.getModel();
            let result = model.getFontStyle();
            if (!$defined(result)) {
                let font = mindplot.TopicStyle.defaultFontStyle(this);
                result = font.style;
            }
            return result;
        }

        /** */
        getFontSize() {
            let model = this.getModel();
            let result = model.getFontSize();
            if (!$defined(result)) {
                let font = mindplot.TopicStyle.defaultFontStyle(this);
                result = font.size;
            }
            return result;
        }

        /** */
        setFontColor(value, updateModel) {
            let textShape = this.getTextShape();
            textShape.setColor(value);
            if ($defined(updateModel) && updateModel) {
                let model = this.getModel();
                model.setFontColor(value);
            }
        }

        _setText(text, updateModel) {
            let textShape = this.getTextShape();
            textShape.setText(text == null ? mindplot.TopicStyle.defaultText(this) : text);

            if ($defined(updateModel) && updateModel) {
                let model = this.getModel();
                model.setText(text);
            }
        }

        /** */
        setText(text) {
            // Avoid empty nodes ...
            if (!text || $.trim(text).length == 0) {
                text = null;
            }

            this._setText(text, true);
            this._adjustShapes();
        }

        /** */
        getText() {
            let model = this.getModel();
            let result = model.getText();
            if (!$defined(result)) {
                result = mindplot.TopicStyle.defaultText(this);
            }
            return result;
        }

        /** */
        setBackgroundColor(color) {
            this._setBackgroundColor(color, true);
        }

        _setBackgroundColor(color, updateModel) {
            let innerShape = this.getInnerShape();
            innerShape.setFill(color);

            let connector = this.getShrinkConnector();
            if (connector) {
                connector.setFill(color);
            }

            if ($defined(updateModel) && updateModel) {
                let model = this.getModel();
                model.setBackgroundColor(color);
            }
        }

        /** */
        getBackgroundColor() {
            let model = this.getModel();
            let result = model.getBackgroundColor();
            if (!$defined(result)) {
                result = mindplot.TopicStyle.defaultBackgroundColor(this);
            }
            return result;
        }

        /** */
        setBorderColor(color) {
            this._setBorderColor(color, true);
        }

        _setBorderColor(color, updateModel) {
            let innerShape = this.getInnerShape();
            innerShape.setAttribute('strokeColor', color);

            let connector = this.getShrinkConnector();
            if (connector) {
                connector.setAttribute('strokeColor', color);
            }

            if ($defined(updateModel) && updateModel) {
                let model = this.getModel();
                model.setBorderColor(color);
            }
        }

        /** */
        getBorderColor() {
            let model = this.getModel();
            let result = model.getBorderColor();
            if (!$defined(result)) {
                result = mindplot.TopicStyle.defaultBorderColor(this);
            }
            return result;
        }

        _buildTopicShape() {
            let groupAttributes = {width: 100, height: 100, coordSizeWidth: 100, coordSizeHeight: 100};
            let group = new web2d.Group(groupAttributes);
            this._set2DElement(group);

            // Shape must be build based on the model width ...
            let outerShape = this.getOuterShape();
            let innerShape = this.getInnerShape();
            let textShape = this.getTextShape();

            // Add to the group ...
            group.append(outerShape);
            group.append(innerShape);
            group.append(textShape);

            // Update figure size ...
            let model = this.getModel();
            if (model.getFeatures().length != 0) {
                this.getOrBuildIconGroup();
            }

            let shrinkConnector = this.getShrinkConnector();
            if ($defined(shrinkConnector)) {
                shrinkConnector.addToWorkspace(group);
            }

            // Register listeners ...
            this._registerDefaultListenersToElement(group, this);
        }

        _registerDefaultListenersToElement(elem, topic) {
            let mouseOver = function(event) {
                if (topic.isMouseEventsEnabled()) {
                    topic.handleMouseOver(event);
                }
            };
            elem.addEvent('mouseover', mouseOver);

            let outout = function(event) {
                if (topic.isMouseEventsEnabled()) {
                    topic.handleMouseOut(event);
                }
            };
            elem.addEvent('mouseout', outout);

            let me = this;
            // Focus events ...
            elem.addEvent('mousedown', function(event) {
                if (!me.isReadOnly()) {
                    // Disable topic selection of readOnly mode ...
                    let value = true;
                    if ((event.metaKey && Browser.Platform.mac) || (event.ctrlKey && !Browser.Platform.mac)) {
                        value = !me.isOnFocus();
                        event.stopPropagation();
                        event.preventDefault();
                    }
                    topic.setOnFocus(value);
                }

                let eventDispatcher = me._getTopicEventDispatcher();
                eventDispatcher.process(mindplot.TopicEvent.CLICK, me);
                event.stopPropagation();
            });
        }

        /** */
        areChildrenShrunken() {
            let model = this.getModel();
            return model.areChildrenShrunken() && !this.isCentralTopic();
        }

        /** */
        isCollapsed() {
            let result = false;

            let current = this.getParent();
            while (current && !result) {
                result = current.areChildrenShrunken();
                current = current.getParent();
            }
            return result;
        }

        /** */
        setChildrenShrunken(value) {
            // Update Model ...
            let model = this.getModel();
            model.setChildrenShrunken(value);

            // Change render base on the state.
            let shrinkConnector = this.getShrinkConnector();
            if ($defined(shrinkConnector)) {
                shrinkConnector.changeRender(value);
            }

            // Do some fancy animation ....
            let elements = this._flatten2DElements(this);
            let fade = new mindplot.util.FadeEffect(elements, !value);
            let me = this;
            fade.addEvent('complete', function() {
                // Set focus on the parent node ...
                if (value) {
                    me.setOnFocus(true);
                }

                // Set focus in false for all the children ...
                elements.forEach(function(elem) {
                    if (elem.setOnFocus) {
                        elem.setOnFocus(false);
                    }
                });
            });
            fade.start();

            mindplot.EventBus.instance.fireEvent(mindplot.EventBus.events.NodeShrinkEvent, model);
        }

        /** */
        getShrinkConnector() {
            let result = this._connector;
            if (this._connector == null) {
                this._connector = new mindplot.ShirinkConnector(this);
                this._connector.setVisibility(false);
                result = this._connector;

            }
            return result;
        }

        /** */
        handleMouseOver() {
            let outerShape = this.getOuterShape();
            outerShape.setOpacity(1);
        }

        /** */
        handleMouseOut() {
            let outerShape = this.getOuterShape();
            if (!this.isOnFocus()) {
                outerShape.setOpacity(0);
            }
        }

        /** */
        showTextEditor(text) {
            this._getTopicEventDispatcher().show(this, {text: text});
        }

        /** */
        showNoteEditor() {
            let topicId = this.getId();
            let model = this.getModel();
            let editorModel = {
                getValue() {
                    let notes = model.findFeatureByType(mindplot.TopicFeature.Note.id);
                    let result;
                    if (notes.length > 0) {
                        result = notes[0].getText();
                    }

                    return result;
                }

                setValue(value) {
                    let dispatcher = mindplot.ActionDispatcher.getInstance();
                    let notes = model.findFeatureByType(mindplot.TopicFeature.Note.id);
                    if (!$defined(value)) {
                        let featureId = notes[0].getId();
                        dispatcher.removeFeatureFromTopic(topicId, featureId);
                    } else {
                        if (notes.length > 0) {
                            dispatcher.changeFeatureToTopic(topicId, notes[0].getId(), {text: value});
                        } else {
                            dispatcher.addFeatureToTopic(topicId, mindplot.TopicFeature.Note.id, {text: value});
                        }
                    }
                }
            };
            let editor = new mindplot.widget.NoteEditor(editorModel);
            this.closeEditors();
            editor.show();
        }

        /** opens a dialog where the user can enter or edit an existing link associated with this topic */
        showLinkEditor() {
            let topicId = this.getId();
            let model = this.getModel();
            let editorModel = {
                getValue() {
                    //@param {mindplot.model.LinkModel[]} links
                    let links = model.findFeatureByType(mindplot.TopicFeature.Link.id);
                    let result;
                    if (links.length > 0) {
                        result = links[0].getUrl();
                    }

                    return result;
                }

                setValue(value) {
                    let dispatcher = mindplot.ActionDispatcher.getInstance();
                    let links = model.findFeatureByType(mindplot.TopicFeature.Link.id);
                    if (!$defined(value)) {
                        let featureId = links[0].getId();
                        dispatcher.removeFeatureFromTopic(topicId, featureId);
                    } else {
                        if (links.length > 0) {
                            dispatcher.changeFeatureToTopic(topicId, links[0].getId(), {url: value});
                        } else {
                            dispatcher.addFeatureToTopic(topicId, mindplot.TopicFeature.Link.id, {url: value});
                        }
                    }
                }
            };

            this.closeEditors();
            let editor = new mindplot.widget.LinkEditor(editorModel);
            editor.show();
        }

        /** */
        closeEditors() {
            this._getTopicEventDispatcher().close(true);
        }

        _getTopicEventDispatcher() {
            return mindplot.TopicEventDispatcher.getInstance();
        }

        /**
         * Point: references the center of the rect shape.!!!
         */
        setPosition(point) {
            $assert(point, 'position can not be null');
            point.x = Math.ceil(point.x);
            point.y = Math.ceil(point.y);

            // Update model's position ...
            let model = this.getModel();
            model.setPosition(point.x, point.y);

            // Elements are positioned in the center.
            // All topic element must be positioned based on the innerShape.
            let size = this.getSize();

            let cx = point.x - (size.width / 2);
            let cy = point.y - (size.height / 2);

            // Update visual position.
            this._elem2d.setPosition(cx, cy);

            // Update connection lines ...
            this._updateConnectionLines();

            // Check object state.
            this.invariant();
        }

        /** */
        getOutgoingLine() {
            return this._outgoingLine;
        }

        /** */
        getIncomingLines() {
            let result = [];
            let children = this.getChildren();
            for (let i = 0; i < children.length; i++) {
                let node = children[i];
                let line = node.getOutgoingLine();
                if ($defined(line)) {
                    result.push(line);
                }
            }
            return result;
        }

        /** */
        getOutgoingConnectedTopic() {
            let result = null;
            let line = this.getOutgoingLine();
            if ($defined(line)) {
                result = line.getTargetTopic();
            }
            return result;
        }

        _updateConnectionLines() {
            // Update this to parent line ...
            let outgoingLine = this.getOutgoingLine();
            if ($defined(outgoingLine)) {
                outgoingLine.redraw();
            }

            // Update all the incoming lines ...
            let incomingLines = this.getIncomingLines();
            for (let i = 0; i < incomingLines.length; i++) {
                incomingLines[i].redraw();
            }

            // Update relationship lines
            for (let j = 0; j < this._relationships.length; j++) {
                this._relationships[j].redraw();
            }
        }

        /** */
        setBranchVisibility(value) {
            let current = this;
            let parent = this;
            while (parent != null && !parent.isCentralTopic()) {
                current = parent;
                parent = current.getParent();
            }
            current.setVisibility(value);
        }

        /** */
        setVisibility(value) {
            this._setTopicVisibility(value);

            // Hide all children...
            this._setChildrenVisibility(value);

            // If there there are connection to the node, topic must be hidden.
            this._setRelationshipLinesVisibility(value);

            // If it's connected, the connection must be rendered.
            let outgoingLine = this.getOutgoingLine();
            if (outgoingLine) {
                outgoingLine.setVisibility(value);
            }
        }

        /** */
        moveToBack() {
            // Update relationship lines
            for (let j = 0; j < this._relationships.length; j++) {
                this._relationships[j].moveToBack();
            }
            let connector = this.getShrinkConnector();
            if ($defined(connector)) {
                connector.moveToBack();
            }

            this.get2DElement().moveToBack();
        }

        /** */
        moveToFront() {
            this.get2DElement().moveToFront();
            let connector = this.getShrinkConnector();
            if ($defined(connector)) {
                connector.moveToFront();
            }
            // Update relationship lines
            for (let j = 0; j < this._relationships.length; j++) {
                this._relationships[j].moveToFront();
            }
        }

        /** */
        isVisible() {
            let elem = this.get2DElement();
            return elem.isVisible();
        }

        _setRelationshipLinesVisibility(value) {
            _.each(this._relationships, function(relationship) {
                let sourceTopic = relationship.getSourceTopic();
                let targetTopic = relationship.getTargetTopic();

                let targetParent = targetTopic.getModel().getParent();
                let sourceParent = sourceTopic.getModel().getParent();
                relationship.setVisibility(value && (targetParent == null || !targetParent.areChildrenShrunken()) && (sourceParent == null || !sourceParent.areChildrenShrunken()));
            });
        }

        _setTopicVisibility(value) {
            let elem = this.get2DElement();
            elem.setVisibility(value);

            if (this.getIncomingLines().length > 0) {
                let connector = this.getShrinkConnector();
                if ($defined(connector)) {
                    connector.setVisibility(value);
                }
            }

            let textShape = this.getTextShape();
            textShape.setVisibility(this.getShapeType() != mindplot.model.TopicShape.IMAGE ? value : false);
        }

        /** */
        setOpacity(opacity) {
            let elem = this.get2DElement();
            elem.setOpacity(opacity);

            let connector = this.getShrinkConnector();
            if ($defined(connector)) {
                connector.setOpacity(opacity);
            }
            let textShape = this.getTextShape();
            textShape.setOpacity(opacity);
        }

        _setChildrenVisibility(isVisible) {
            // Hide all children.
            let children = this.getChildren();
            let model = this.getModel();

            isVisible = isVisible ? !model.areChildrenShrunken() : isVisible;
            for (let i = 0; i < children.length; i++) {
                let child = children[i];
                child.setVisibility(isVisible);

                let outgoingLine = child.getOutgoingLine();
                outgoingLine.setVisibility(isVisible);
            }

        }

        /** */
        invariant() {
            let line = this._outgoingLine;
            let model = this.getModel();
            let isConnected = model.isConnected();

            // Check consistency...
            if ((isConnected && !line) || (!isConnected && line)) {
                // $assert(false,'Illegal state exception.');
            }
        }

        /** */
        setSize(size, force) {
            $assert(size, 'size can not be null');
            $assert($defined(size.width), 'size seem not to be a valid element');
            size = {width: Math.ceil(size.width), height: Math.ceil(size.height)};

            let oldSize = this.getSize();
            let hasSizeChanged = oldSize.width != size.width || oldSize.height != size.height;
            if (hasSizeChanged || force) {
                mindplot.NodeGraph.prototype.setSize.call(this, size);

                let outerShape = this.getOuterShape();
                let innerShape = this.getInnerShape();

                outerShape.setSize(size.width + 4, size.height + 6);
                innerShape.setSize(size.width, size.height);

                // Update the figure position(ej: central topic must be centered) and children position.
                this._updatePositionOnChangeSize(oldSize, size);

                if (hasSizeChanged) {
                    mindplot.EventBus.instance.fireEvent(mindplot.EventBus.events.NodeResizeEvent, {
                        node: this.getModel(),
                        size: size
                    });
                }
            }
        }

        _updatePositionOnChangeSize() {
            $assert(false, 'this method must be overwrited.');
        }

        /** */
        disconnect(workspace) {
            let outgoingLine = this.getOutgoingLine();
            if ($defined(outgoingLine)) {
                $assert(workspace, 'workspace can not be null');

                this._outgoingLine = null;

                // Disconnect nodes ...
                let targetTopic = outgoingLine.getTargetTopic();
                targetTopic.removeChild(this);

                // Update model ...
                let childModel = this.getModel();
                childModel.disconnect();

                this._parent = null;

                // Remove graphical element from the workspace...
                outgoingLine.removeFromWorkspace(workspace);

                // Remove from workspace.
                mindplot.EventBus.instance.fireEvent(mindplot.EventBus.events.NodeDisconnectEvent, this.getModel());

                // Change text based on the current connection ...
                let model = this.getModel();
                if (!model.getText()) {
                    let text = this.getText();
                    this._setText(text, false);
                }
                if (!model.getFontSize()) {
                    let size = this.getFontSize();
                    this.setFontSize(size, false);
                }

                // Hide connection line?.
                if (targetTopic.getChildren().length == 0) {
                    let connector = targetTopic.getShrinkConnector();
                    if ($defined(connector)) {
                        connector.setVisibility(false);
                    }
                }
            }
        }

        /** */
        getOrder() {
            let model = this.getModel();
            return model.getOrder();
        }

        /** */
        setOrder(value) {
            let model = this.getModel();
            model.setOrder(value);
        }

        /** */
        connectTo(targetTopic, workspace) {
            $assert(!this._outgoingLine, 'Could not connect an already connected node');
            $assert(targetTopic != this, 'Circular connection are not allowed');
            $assert(targetTopic, 'Parent Graph can not be null');
            $assert(workspace, 'Workspace can not be null');

            // Connect Graphical Nodes ...
            targetTopic.append(this);
            this._parent = targetTopic;

            // Update model ...
            let targetModel = targetTopic.getModel();
            let childModel = this.getModel();
            childModel.connectTo(targetModel);

            // Create a connection line ...
            let outgoingLine = new mindplot.ConnectionLine(this, targetTopic);
            outgoingLine.setVisibility(false);

            this._outgoingLine = outgoingLine;
            workspace.append(outgoingLine);

            // Update figure is necessary.
            this.updateTopicShape(targetTopic);

            // Change text based on the current connection ...
            let model = this.getModel();
            if (!model.getText()) {
                let text = this.getText();
                this._setText(text, false);
            }
            if (!model.getFontSize()) {
                let size = this.getFontSize();
                this.setFontSize(size, false);
            }
            this.getTextShape();

            // Display connection node...
            let connector = targetTopic.getShrinkConnector();
            if ($defined(connector)) {
                connector.setVisibility(true);
            }

            // Redraw line ...
            outgoingLine.redraw();

            // Fire connection event ...
            if (this.isInWorkspace()) {
                mindplot.EventBus.instance.fireEvent(mindplot.EventBus.events.NodeConnectEvent, {
                    parentNode: targetTopic.getModel(),
                    childNode: this.getModel()
                });
            }
        }

        /** */
        append(child) {
            let children = this.getChildren();
            children.push(child);
        }

        /** */
        removeChild(child) {
            let children = this.getChildren();
            children.erase(child);
        }

        /** */
        getChildren() {
            let result = this._children;
            if (!$defined(result)) {
                this._children = [];
                result = this._children;
            }
            return result;
        }

        /** */
        removeFromWorkspace(workspace) {
            let elem2d = this.get2DElement();
            workspace.removeChild(elem2d);
            let line = this.getOutgoingLine();
            if ($defined(line)) {
                workspace.removeChild(line);
            }
            this._isInWorkspace = false;
            mindplot.EventBus.instance.fireEvent(mindplot.EventBus.events.NodeRemoved, this.getModel());
        }

        /** */
        addToWorkspace(workspace) {
            let elem = this.get2DElement();
            workspace.append(elem);
            if (!this.isInWorkspace()) {
                if (!this.isCentralTopic()) {
                    mindplot.EventBus.instance.fireEvent(mindplot.EventBus.events.NodeAdded, this.getModel());
                }

                if (this.getModel().isConnected()) {
                    mindplot.EventBus.instance.fireEvent(mindplot.EventBus.events.NodeConnectEvent, {
                        parentNode: this.getOutgoingConnectedTopic().getModel(),
                        childNode: this.getModel()
                    });
                }
            }
            this._isInWorkspace = true;
            this._adjustShapes();
        }

        /** */
        isInWorkspace() {
            return this._isInWorkspace;
        }

        /** */
        createDragNode(layoutManager) {
            let result = this.parent(layoutManager);

            // Is the node already connected ?
            let targetTopic = this.getOutgoingConnectedTopic();
            if ($defined(targetTopic)) {
                result.connectTo(targetTopic);
                result.setVisibility(false);
            }

            // If a drag node is create for it, let's hide the editor.
            this._getTopicEventDispatcher().close();

            return result;
        }

        _adjustShapes() {
            if (this._isInWorkspace) {
                let textShape = this.getTextShape();
                if (this.getShapeType() != mindplot.model.TopicShape.IMAGE) {
                    let textWidth = textShape.getWidth();

                    let textHeight = textShape.getHeight();
                    textHeight = textHeight != 0 ? textHeight : 20;

                    let topicPadding = mindplot.TopicStyle.getInnerPadding(this);

                    // Adjust the icon size to the size of the text ...
                    let iconGroup = this.getOrBuildIconGroup();
                    let fontHeight = this.getTextShape().getFontHeight();
                    iconGroup.setPosition(topicPadding, topicPadding);
                    iconGroup.seIconSize(fontHeight, fontHeight);

                    // Add a extra padding between the text and the icons
                    let iconsWidth = iconGroup.getSize().width;
                    if (iconsWidth != 0) {
                        iconsWidth = iconsWidth + (textHeight / 4);
                    }

                    let height = textHeight + (topicPadding * 2);
                    let width = textWidth + iconsWidth + (topicPadding * 2);

                    this.setSize({width: width, height: height});

                    // Position node ...
                    textShape.setPosition(topicPadding + iconsWidth, topicPadding);
                } else {
                    // In case of images, the size if fixed ...
                    let size = this.getModel().getImageSize();
                    this.setSize(size);
                }
            }
        }

        _flatten2DElements(topic) {
            let result = [];

            let children = topic.getChildren();
            for (let i = 0; i < children.length; i++) {
                let child = children[i];
                result.push(child);
                result.push(child.getOutgoingLine());

                let relationships = child.getRelationships();
                result = result.concat(relationships);

                if (!child.areChildrenShrunken()) {
                    let innerChilds = this._flatten2DElements(child);
                    result = result.concat(innerChilds);
                }
            }
            return result;
        }

        /**
         * @param childTopic
         * @return {Boolean} true if childtopic is a child topic of this topic or the topic itself
         */
        isChildTopic(childTopic) {
            let result = (this.getId() == childTopic.getId());
            if (!result) {
                let children = this.getChildren();
                for (let i = 0; i < children.length; i++) {
                    let parent = children[i];
                    result = parent.isChildTopic(childTopic);
                    if (result) {
                        break;
                    }
                }
            }
            return result;
        }

        /** @return {Boolean} true if the topic is the central topic of the map */
        isCentralTopic() {
            return this.getModel().getType() == mindplot.model.INodeModel.CENTRAL_TOPIC_TYPE;
        }
    }
});

/**
 * @constant
 * @type {Number}
 * @default
 */
mindplot.Topic.CONNECTOR_WIDTH = 6;

/**
 * @constant
 * @type {Object<String, Number>}
 * @default
 */
mindplot.Topic.OUTER_SHAPE_ATTRIBUTES = {fillColor: 'rgb(252,235,192)', stroke: '1 dot rgb(241,163,39)', x: 0, y: 0};

/**
 * @constant
 * @type {Object<String, Number>}
 * @default
 */
mindplot.Topic.OUTER_SHAPE_ATTRIBUTES_FOCUS = {fillColor: 'rgb(244,184,45)', x: 0, y: 0};

/**
 * @constant
 * @type {Object<String>}
 * @default
 * */
mindplot.Topic.INNER_RECT_ATTRIBUTES = {stroke: '2 solid'};
