mindplot.widget.NoteEditor = new Class({
    Extends: BootstrapDialog,

    initialize: function(model) {
        $assert(model, "model can not be null");
        this._model = model;
        this.parent($msg("Note"), {
            cancelButton: true,
            closeButton: true,
            acceptButton: true,
            removeButton: typeof model.getValue() != 'undefined',
            onEventData: {model: this._model}
        });
        this.css({margin:"150px auto"});
        var panel = this._buildPanel(model);
        this.setContent(panel);
    },

    _buildPanel: function(model) {
        var result = $('<div></div>').css("padding-top", "5px");
        var form = $('<form></form>').attr({
            'action':'none',
            'id':'noteFormId'
        });

        // Add textarea
        var textArea = $('<textarea></textarea autofocus>').attr({
                'placeholder':$msg('WRITE_YOUR_TEXT_HERE'),
                'required':'true',
                'class':'form-control'
        });
        textArea.css({
            'width':'100%',
            'height':80,
            'resize':'none'
        });
        textArea.on("keypress", function(event) {
            event.stopPropagation();
        });
        form.append(textArea);

        if (model.getValue() != null){
            textArea.val(model.getValue());
        }

        result.append(form);
        return result;
    },

    onAcceptClick: function(event) {
        event.data.dialog._submitForm(event.data.model);
    },

    _submitForm: function(model) {
        var textarea = this._native.find("textarea");
        if (textarea.val()) {
            model.setValue(textarea.val());
        }
        this.close();
    },

    onDialogShown: function() {
        $(this).find('textarea').focus();
    },

    onRemoveClick: function(event) {
        event.data.model.setValue(null);
        event.data.dialog.close();
    }
});
