mindplot.widget.KeyboardShortcutTooltip = new Class({
    Extends: mindplot.widget.FloatingTip,

    initialize: function(buttonElem, text) {
        $assert(buttonElem, "buttonElem can not be null");
        $assert(text, "text can not be null");
        this._text = text;

        var children = buttonElem.children().first();
        var tipElemId = buttonElem.attr('id') + "Tip";
        var tipDiv = $('<div></div>').attr('id', tipElemId);
        tipDiv.append(children);
        buttonElem.append(tipDiv);

        this.parent(tipDiv, {
            //Content can also be a functionof the target element!
            content: this._buildContent(),
            html: true,
            placement: 'bottom',
            className: 'keyboardShortcutTip',
            template: '<div class="popover popoverBlack" role="tooltip"><div class="arrow arrowBlack"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
        });

        tipDiv.on('click', function(e) {
            tipDiv.trigger('mouseleave', e);
        });
    },

    _buildContent: function() {
        var result = $('<div></div>');
        result.css({
            padding:'3px 0px',
            width:'100%',
            color: "white"
        });

        var textContainer = $('<div></div>').text(this._text);
        textContainer.css({
            width: '100%',
            'font-size': "90%",
            textAlign: 'center',
            'font-weight':'bold'
        });

        result.append(textContainer);
        return result;
    }
});
