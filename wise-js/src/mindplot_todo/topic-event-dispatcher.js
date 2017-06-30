mindplot.TopicEventDispatcher = new Class({
    Extends: mindplot.Events,

    Static: {
        _instance: null,

        configure: function(readOnly) {
            this._instance = new mindplot.TopicEventDispatcher(readOnly);
        },

        getInstance: function() {
            return this._instance;
        }
    },

    initialize: function(readOnly) {
        this._readOnly = readOnly;
        this._activeEditor = null;
        this._multilineEditor = new mindplot.MultilineTextEditor();
    },

    close: function(update) {
        if (this.isVisible()) {
            this._activeEditor.close(update);
            this._activeEditor = null;
        }
    },

    show: function(topic, options) {
        this.process(mindplot.TopicEvent.EDIT, topic, options);
    },

    process: function(eventType, topic, options) {
        $assert(eventType, "eventType can not be null");

        // Close all previous open editor ....
        if (this.isVisible()) {
            this.close();
        }

        // Open the new editor ...
        var model = topic.getModel();
        if (model.getShapeType() != mindplot.model.TopicShape.IMAGE && !this._readOnly && eventType == mindplot.TopicEvent.EDIT) {
            this._multilineEditor.show(topic, options ? options.text : null);
            this._activeEditor = this._multilineEditor;
        } else {
            this.fireEvent(eventType, {model: model, readOnly: this._readOnly});
        }
    },

    isVisible: function() {
        return this._activeEditor != null && this._activeEditor.isVisible();
    }
});

mindplot.TopicEvent = {
    EDIT: "editnode",
    CLICK: "clicknode"
};
