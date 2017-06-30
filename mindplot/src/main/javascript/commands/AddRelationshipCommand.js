mindplot.commands.AddRelationshipCommand = new Class(/** @lends AddRelationshipCommand */{
    Extends: mindplot.Command,

    /**
     * @classdesc This command class handles do/undo of adding a relationship to a topic.
     * @constructs
     * @param {XMLDOM} model
     * @extends mindplot.Command
     */
    initialize: function(model) {
        $assert(model, 'Relationship model can not be null');

        this.parent();
        this._model = model;
    },

    /**
     * Overrides abstract parent method
     */
    execute: function(commandContext) {
        var relationship = commandContext.addRelationship(this._model);
        relationship.setOnFocus(true);
    },

    /**
     * Overrides abstract parent method
     * @see {@link mindplot.Command.undoExecute}
     */
    undoExecute: function(commandContext) {
        var rel = commandContext.findRelationships(this._model.getId());
        commandContext.deleteRelationship(rel[0]);
    }
});
