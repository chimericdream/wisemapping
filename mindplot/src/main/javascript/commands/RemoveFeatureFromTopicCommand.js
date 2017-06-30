mindplot.commands.RemoveFeatureFromTopicCommand = new Class(/**@lends RemoveFeatureFromTopicCommand */{
    Extends: mindplot.Command,

    /**
     * @classdesc This command handles do/undo of removing a feature from a topic, e.g. an icon or
     * a note. For a reference of existing features, refer to {@link mindplot.TopicFeature}.
     * @constructs
     * @param {String} topicId id of the topic to remove the feature from
     * @param {String} featureId id of the feature to remove
     * @extends mindplot.Command
     */
    initialize: function(topicId, featureId) {
        $assert($defined(topicId), 'topicId can not be null');
        $assert(featureId, 'iconModel can not be null');

        this.parent();
        this._topicId = topicId;
        this._featureId = featureId;
        this._oldFeature = null;
    },

    /**
     * Overrides abstract parent method
     */
    execute: function(commandContext) {
        var topic = commandContext.findTopics(this._topicId)[0];
        var feature = topic.findFeatureById(this._featureId);
        topic.removeFeature(feature);
        this._oldFeature = feature;
    },

    /**
     * Overrides abstract parent method
     * @see {@link mindplot.Command.undoExecute}
     */
    undoExecute: function(commandContext) {
        var topic = commandContext.findTopics(this._topicId)[0];
        topic.addFeature(this._oldFeature);
        this._oldFeature = null;
    }
});
