mindplot.commands.AddTopicCommand = new Class(/** @lends AddTopicCommand */{
    Extends: mindplot.Command,

    /**
     * @classdesc This command class handles do/undo of adding one or multiple topics to
     * the mindmap.
     * @constructs
     * @param {Array<mindplot.model.NodeModel>} models one or multiple models
     * @param {Array<String>} parentTopicsId ids of the parent topics to add the children to, or null
     * when attaching a dragged node or a node/branch from clipboard
     * @extends mindplot.Command
     */
    initialize: function(models, parentTopicsId) {
        $assert(models, 'models can not be null');
        $assert(parentTopicsId == null || parentTopicsId.length == models.length, 'parents and models must have the same size');

        this.parent();
        this._models = models;
        this._parentsIds = parentTopicsId;
    },

    /**
     * Overrides abstract parent method
     */
    execute: function(commandContext) {
        var me = this;
        _.each(this._models, function(model, index) {
            // Add a new topic ...
            var topic = commandContext.createTopic(model);

            // Connect to topic ...
            if (me._parentsIds) {
                var parentId = me._parentsIds[index];
                if ($defined(parentId)) {
                    var parentTopic = commandContext.findTopics(parentId)[0];
                    commandContext.connect(topic, parentTopic);
                }
            } else {
                commandContext.addTopic(topic);
            }

            // Select just created node ...
            var designer = commandContext._designer;
            designer.onObjectFocusEvent(topic);
            topic.setOnFocus(true);

            // Render node ...
            topic.setVisibility(true);
        });
    },

    /**
     * Overrides abstract parent method
     * @see {@link mindplot.Command.undoExecute}
     */
    undoExecute: function(commandContext) {
        // Delete disconnected the nodes. Create a copy of the topics ...
        var clonedModel = [];
        _.each(this._models, function(model) {
           clonedModel.push(model.clone());
        });

        // Finally, remove the nodes ...
        _.each(this._models, function(model) {
            var topicId = model.getId();
            var topic = commandContext.findTopics(topicId)[0];
            commandContext.deleteTopic(topic);
        });

        this._models = clonedModel;
    }
});
