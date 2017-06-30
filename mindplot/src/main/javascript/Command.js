mindplot.Command = new Class(/** @lends mindplot.Command */{
    /**
     * @classdesc The command base class for handling do/undo mindmap operations
     * @constructs
     */
    initialize: function() {
        this._id = mindplot.Command._nextUUID();
    },

    /**
     * @abstract
     */
    execute: function(commandContext) {
        throw "execute must be implemented.";
    },

    /**
     * Triggered by the undo button - reverses the executed command
     * @abstract
     */
    undoExecute: function(commandContext) {
        throw "undo must be implemented.";
    },

    /**
     * Returns the unique id of this command
     * @returns {Number} command id
     */
    getId: function() {
        return this._id;
    }
});

mindplot.Command._nextUUID = function() {
    if (!$defined(mindplot.Command._uuid)) {
        mindplot.Command._uuid = 1;
    }

    mindplot.Command._uuid = mindplot.Command._uuid + 1;
    return mindplot.Command._uuid;
};
