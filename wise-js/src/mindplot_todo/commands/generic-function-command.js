mindplot.commands.GenericFunctionCommand = new Class(/** @lends GenericFunctionCommand */{
    Extends: mindplot.Command,

    /**
     * @classdesc This command handles do/undo of different actions, e.g. moving topics to
     * a different position, changing text or font,... (for full reference check the
     * StandaloneActionDispatcher i.e. the ActionDispatcher subclass in use)
     * @constructs
     * @param {Function} commandFunc the functionthe command shall execute
     * @param {String|Array<String>} topicsIds the ids of the topics affected
     * @param {Object} [value] value arbitrary value necessary for the execution of the function,
     * e.g. color, font family or text
     * @extends mindplot.Command
     */
    initialize: function(commandFunc, topicsIds, value) {
        $assert(commandFunc, "commandFunc must be defined");
        $assert($defined(topicsIds), "topicsIds must be defined");

        this.parent();
        this._value = value;
        this._topicsId = topicsIds;
        this._commandFunc = commandFunc;
        this._oldValues = [];
    },

    /**
     * Overrides abstract parent method
     */
    execute: function(commandContext) {
        if (!this.applied) {
            var topics = null;
            try {
                topics = commandContext.findTopics(this._topicsId);
            } catch (e) {
                if (this._commandFunc.commandType != "changeTextToTopic") {
                    // Workaround: For some reason, there is a combination of events that involves
                    // making some modification and firing out of focus event. This is causing
                    // that a remove node try to be removed.  In some other life, I will come with the solution.
                    // Almost aways occurs with IE9. I could be related with some change of order in sets o something similar.
                    throw  e;
                }
            }

            if (topics != null) {
                var me = this;
                _.each(topics, function(topic) {
                    var oldValue = me._commandFunc(topic, me._value);
                    me._oldValues.push(oldValue);
                });
            }
            this.applied = true;
        } else {
            throw "Command can not be applied two times in a row.";
        }
    },

    /**
     * Overrides abstract parent method
     * @see {@link mindplot.Command.undoExecute}
     */
    undoExecute: function(commandContext) {
        if (this.applied) {
            var topics = commandContext.findTopics(this._topicsId);
            var me = this;
            _.each(topics, function(topic, index) {
                me._commandFunc(topic, me._oldValues[index]);
            });

            this.applied = false;
            this._oldValues = [];
        } else {
            throw "undo can not be applied.";
        }
    }
});
