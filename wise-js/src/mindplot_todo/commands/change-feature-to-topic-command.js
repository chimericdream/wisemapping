mindplot.commands.ChangeFeatureToTopicCommand = new Class(/** @lends ChangeFeatureToTopicCommand */{
    Extends: mindplot.Command,

    /**
     * @extends mindplot.Command
     * @constructs
     * @param topicId
     * @param featureId
     * @param attributes
     * @throws will throw an error if topicId is null or undefined
     * @throws will throw an error if featureId is null or undefined
     * @throws will throw an error if attributes is null or undefined
     */
    initialize: function(topicId, featureId, attributes) {
        $assert($defined(topicId), 'topicId can not be null');
        $assert($defined(featureId), 'featureId can not be null');
        $assert($defined(attributes), 'attributes can not be null');

        this.parent();
        this._topicId = topicId;
        this._featureId = featureId;
        this._attributes = attributes;
    },

    /**
     * Overrides abstract parent method
     */
    execute: function(commandContext) {
        var topic = commandContext.findTopics(this._topicId)[0];
        var feature = topic.findFeatureById(this._featureId);

        var oldAttributes = feature.getAttributes();
        feature.setAttributes(this._attributes);
        this._attributes = oldAttributes;
    },

    /**
     * Overrides abstract parent method
     * @see {@link mindplot.Command.undoExecute}
     */
    undoExecute: function(commandContext) {
        this.execute(commandContext);
    }
});
