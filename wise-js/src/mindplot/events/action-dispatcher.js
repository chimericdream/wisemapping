/* global define */
'use strict';

define(['assert', 'mindplot/events'], ($assert, Events) => {
    let _instance = null;

    class ActionDispatcher extends Events {
        static get instance() {
            return _instance;
        }

        static set instance(dispatcher) {
            _instance = dispatcher;
        }

        constructor(commandContext) {
            super();
            $assert(commandContext, "commandContext can not be null");
        }

        addRelationship(model, mindmap) {
            throw "method must be implemented.";
        }

        addTopics(models, parentTopicId) {
            throw "method must be implemented.";
        }

        deleteEntities(topicsIds, relIds) {
            throw "method must be implemented.";
        }

        dragTopic(topicId, position, order, parentTopic) {
            throw "method must be implemented.";
        }

        moveTopic(topicId, position) {
            throw "method must be implemented.";
        }

        moveControlPoint(ctrlPoint, point) {
            throw "method must be implemented.";
        }

        changeFontFamilyToTopic(topicIds, fontFamily) {
            throw "method must be implemented.";
        }

        changeFontStyleToTopic(topicsIds) {
            throw "method must be implemented.";
        }

        changeFontColorToTopic(topicsIds, color) {
            throw "method must be implemented.";
        }

        changeFontSizeToTopic(topicsIds, size) {
            throw "method must be implemented.";
        }

        changeBackgroundColorToTopic(topicsIds, color) {
            throw "method must be implemented.";
        }

        changeBorderColorToTopic(topicsIds, color) {
            throw "method must be implemented.";
        }

        changeShapeTypeToTopic(topicsIds, shapeType) {
            throw "method must be implemented.";
        }

        changeFontWeightToTopic(topicsIds) {
            throw "method must be implemented.";
        }

        changeTextToTopic(topicsIds, text) {
            throw "method must be implemented.";
        }

        shrinkBranch(topicsIds, collapse) {
            throw "method must be implemented.";
        }

        addFeatureToTopic(topicId, type, attributes) {
            throw "method must be implemented.";
        }

        changeFeatureToTopic(topicId, featureId, attributes) {
            throw "method must be implemented.";
        }

        removeFeatureFromTopic(topicId, featureId) {
            throw "method must be implemented.";
        }
    }

    return ActionDispatcher;
});
