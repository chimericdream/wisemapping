mindplot.DesignerActionRunner = new Class({
    initialize: function(commandContext, notifier) {
        $assert(commandContext, "commandContext can not be null");

        this._undoManager = new mindplot.DesignerUndoManager();
        this._context = commandContext;
        this._notifier = notifier;
    },

    execute: function(command) {
        $assert(command, "command can not be null");
        command.execute(this._context);
        this._undoManager.enqueue(command);
        this.fireChangeEvent();
        mindplot.EventBus.instance.fireEvent(mindplot.EventBus.events.DoLayout);
    },

    undo: function() {
        this._undoManager.execUndo(this._context);
        this.fireChangeEvent();
        mindplot.EventBus.instance.fireEvent(mindplot.EventBus.events.DoLayout);
    },

    redo: function() {
        this._undoManager.execRedo(this._context);
        this.fireChangeEvent();
        mindplot.EventBus.instance.fireEvent(mindplot.EventBus.events.DoLayout);
    },

    fireChangeEvent: function() {
        var event = this._undoManager.buildEvent();
        this._notifier.fireEvent("modelUpdate", event);
    }
});
