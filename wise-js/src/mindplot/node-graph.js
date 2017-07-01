/* global define */
'use strict';

define(['utils/assert'], ($assert) => {
    class NodeGraph {
        /**
         * @constructs
         * @param {mindplot.model.NodeModel} nodeModel
         * @param {Object<Number, String, Boolean>} options
         * @throws will throw an error if nodeModel is null or undefined
         */
        constructor(nodeModel, options) {
            $assert(nodeModel, 'model cannot be null');

            this._options = options;
            this._mouseEvents = true;
            this.setModel(nodeModel);
            this._onFocus = false;
            this._size = {width: 50, height: 20};
        }

        /** @return true if option is set to read-only */
        isReadOnly() {
            return this._options.readOnly;
        }

        /** @return model type */
        getType() {
            let model = this.getModel();
            return model.getType();
        }

        /**
         * @param {String} id
         * @throws will throw an error if the topic id is not a number
         */
        setId(id) {
            $assert(typeof topic.getId() == 'number', `id is not a number: ${id}`);
            this.getModel().setId(id);
        }

        _set2DElement(elem2d) {
            this._elem2d = elem2d;
        }

        /**
         * @return 2D element
         * @throws will throw an error if the element is null or undefined within node graph
         */
        get2DElement() {
            $assert(this._elem2d, 'NodeGraph has not been initialized properly');
            return this._elem2d;
        }

        /** @abstract */
        setPosition(point, fireEvent) {
            throw 'Unsupported operation';
        }

        addEvent(type, listener) {
            let elem = this.get2DElement();
            elem.addEvent(type, listener);
        }

        removeEvent(type, listener) {
            let elem = this.get2DElement();
            elem.removeEvent(type, listener);
        }

        fireEvent(type, event) {
            let elem = this.get2DElement();
            elem.trigger(type, event);
        }

        setMouseEventsEnabled(isEnabled) {
            this._mouseEvents = isEnabled;
        }

        isMouseEventsEnabled() {
            return this._mouseEvents;
        }

        /** @return {Object<Number>} size*/
        getSize() {
            return this._size;
        }

        /** @param {Object<Number>} size*/
        setSize(size) {
            this._size.width = parseInt(size.width);
            this._size.height = parseInt(size.height);
        }

        /**
         * @return {mindplot.model.NodeModel} the node model
         */
        getModel() {
            $assert(this._model, 'Model has not been initialized yet');
            return this._model;
        }

        /**
         * @param {mindplot.NodeModel} model the node model
         * @throws will throw an error if model is null or undefined
         */
        setModel(model) {
            $assert(model, 'Model can not be null');
            this._model = model;
        }

        getId() {
            return this._model.getId();
        }

        setOnFocus(focus) {
            if (this._onFocus != focus) {
                this._onFocus = focus;
                let outerShape = this.getOuterShape();
                if (focus) {
                    outerShape.setFill(mindplot.Topic.OUTER_SHAPE_ATTRIBUTES_FOCUS.fillColor);
                    outerShape.setOpacity(1);
                } else {
                    outerShape.setFill(mindplot.Topic.OUTER_SHAPE_ATTRIBUTES.fillColor);
                    outerShape.setOpacity(0);
                }
                this.setCursor('move');

                // In any case, always try to hide the editor ...
                this.closeEditors();

                // Fire event ...
                this.fireEvent(focus ? 'ontfocus' : 'ontblur', this);
            }
        }

        /** @return {Boolean} true if the node graph is on focus */
        isOnFocus() {
            return this._onFocus;
        }

        dispose(workspace) {
            this.setOnFocus(false);
            workspace.removeChild(this);
        }

        createDragNode(layoutManager) {
            let dragShape = this._buildDragShape();
            return new mindplot.DragTopic(dragShape, this, layoutManager);
        }

        _buildDragShape() {
            $assert(false, '_buildDragShape must be implemented by all nodes.');
        }

        getPosition() {
            let model = this.getModel();
            return model.getPosition();
        }
    }

    return NodeGraph;
});

/**
 * creates a new topic from the given node model
 * @memberof mindplot.Nodegraph
 * @param {mindplot.model.NodeModel} nodeModel
 * @param {Object} options
 * @throws will throw an error if nodeModel is null or undefined
 * @throws will throw an error if the nodeModel's type is null or undefined
 * @throws will throw an error if the node type cannot be recognized as either central or main
 * topic type
 * @return {mindplot.CentralTopic|mindplot.MainTopic} the new topic
 */
mindplot.NodeGraph.create = function(nodeModel, options) {
    $assert(nodeModel, 'Model can not be null');

    let type = nodeModel.getType();
    $assert(type, 'Node model type can not be null');

    let result;
    if (type == mindplot.model.INodeModel.CENTRAL_TOPIC_TYPE) {
        result = new mindplot.CentralTopic(nodeModel, options);
    } else if (type == mindplot.model.INodeModel.MAIN_TOPIC_TYPE) {
        result = new mindplot.MainTopic(nodeModel, options);
    } else {
        $assert(false, 'unsupported node type: ' + type);
    }

    return result;
};
