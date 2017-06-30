mindplot.widget.LinkEditor = new Class(/** @lends LinkEditor */{
    Extends: BootstrapDialog,

    /**
     * @constructs
     * @param model
     * @throws will throw an error if model is null or undefined
     * @extends BootstrapDialog
     */
    initialize: function(model) {
        $assert(model, "model can not be null");
        this._model = model;
        this.parent($msg("LINK"), {
            cancelButton: true,
            closeButton: true,
            acceptButton: true,
            removeButton: typeof model.getValue() != 'undefined',
            errorMessage: true,
            onEventData: {model: this._model}
        });
        this.css({margin:"150px auto"});
        var panel = this._buildPanel(model);
        this.setContent(panel);
    },

    _buildPanel: function(model) {
        var result = $('<div></div>').css("padding-top", "5px");
        this.form = $('<form></form>').attr({
            'action': 'none',
            'id': 'linkFormId'
        });
        var text = $('<p></p>').text("Paste your url here:");
        text.css('margin','0px 0px 20px');

        this.form.append(text);

        var section = $('<div></div>').attr({
            'class': 'input-group'
        });

        // Add Input
        var input = $('<input id="inputUrl"/>').attr({
            'placeholder': 'http://www.example.com/',
            'required': 'true',
            'autofocus': 'autofocus',
            'class': 'form-control'
        });
        input.on("keypress", function(event) {
            event.stopPropagation();
        });

        if (model.getValue() != null){
            input.val(model.getValue());
        }

        // Open Button
        var openButton = $('<button></button>').attr({
                'type': 'button',
                'class': 'btn btn-default'
        });

        openButton.html($msg('OPEN_LINK')).css('margin-left', '0px');
        openButton.click(function(){
            window.open(input.val(),"_blank", "status=1,width=700,height=450,resize=1");
        });
        var spanControl = $('<span class="input-group-btn"></span>').append(openButton);

        section.append(input);
        section.append(spanControl);
        this.form.append(section);

        var me = this;
        this.form.unbind('submit').submit(
            function(event) {
                event.preventDefault();
                if(me.checkURL(input.val())){
                    me.cleanError();
                    var inputValue = input.val();
                    if (inputValue != null && $.trim(inputValue) != "") {
                        model.setValue(inputValue);
                    }
                    me.close();
                    this.formSubmitted = true;
                } else {
                    me.alertError($msg('URL_ERROR'));
                    event.stopPropagation();
                }
            }
        );

        result.append(this.form);
        return result;
    },

    /**
     * checks whether the input is a valid url
     * @return {Boolean} true if the url is valid
     */
    checkURL: function(url){
        var regex = /^(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
        return(regex.test(url));
    },

    /**
     * overrides abstract parent method
     * triggered when the user clicks the accept button - submits the url input
     * @param event
     */
    onAcceptClick: function(event) {
        this.formSubmitted = false;
        $("#linkFormId").trigger('submit');
        if (!this.formSubmitted) {
            event.stopPropagation();
        }
    },

    /**
     * overrides parent method
     * sets the url input on focus
     */
    onDialogShown: function() {
        $(this).find('#inputUrl').focus();
    },

    /**
     * overrides abstract parent method
     * triggered when the user clicks the remove button - deletes the link
     */
    onRemoveClick: function(event) {
        event.data.model.setValue(null);
        event.data.dialog.close();
    }
});
