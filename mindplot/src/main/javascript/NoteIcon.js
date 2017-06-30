mindplot.NoteIcon = new Class({
    Extends: mindplot.Icon,

    initialize: function(topic, noteModel, readOnly) {
        $assert(topic, 'topic can not be null');

        this.parent(mindplot.NoteIcon.IMAGE_URL);
        this._linksModel = noteModel;
        this._topic = topic;
        this._readOnly = readOnly;

        this._registerEvents();
    },

    _registerEvents: function() {
        this._image.setCursor('pointer');
        var me = this;

        if (!this._readOnly) {
            // Add on click event to open the editor ...
            this.addEvent('click', function(event) {
                me._topic.showNoteEditor();
                event.stopPropagation();
            });
        }
        this._tip = new mindplot.widget.FloatingTip($(me.getImage()._peer._native), {
            title: $msg('NOTE'),
            container: 'body',
            // Content can also be a functionof the target element!
            content: function() {
                return me._buildTooltipContent();
            },
            html: true,
            placement: 'bottom',
            destroyOnExit: true
        });
    },

    _buildTooltipContent: function() {
        if ($("body").find("#textPopoverNote").length == 1) {
            var text = $("body").find("#textPopoverNote");
            text.text(this._linksModel.getText());
        } else {
            var result = $('<div id="textPopoverNote"></div>').css({padding: '5px'});

            var text = $('<div></div>').text(this._linksModel.getText())
                .css({
                    'white-space': 'pre-wrap',
                    'word-wrap': 'break-word'
                }
            );
            result.append(text);
            return result;
        }
    },

    getModel: function() {
        return this._linksModel;
    }
});

mindplot.NoteIcon.IMAGE_URL = "images/notes.png";
