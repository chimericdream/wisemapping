mindplot.widget.ListToolbarPanel = new Class({
    Extends: mindplot.widget.ToolbarPaneItem,

    initialize: function(buttonId, model) {
        this.parent(buttonId, model);
        this._initPanel();
    },

    _initPanel: function() {
        // Register on toolbar elements ...
        var me = this;
        this.getPanelElem().children('div').bind('click', function(event) {
            event.stopPropagation();
            me.hide();
            var value = $defined($(this).attr('model')) ? $(this).attr('model') : $(this).attr('id');
            me.getModel().setValue(value);
        });
    },

    _updateSelectedItem: function() {
        var panelElem = this.getPanelElem();
        var menuElems = panelElem.find('div');
        var value = this.getModel().getValue();
        _.each(menuElems, function(elem) {
            var elemValue = $defined($(elem).attr('model')) ? $(elem).attr('model') : $(elem).attr('id');
            $assert(elemValue, "elemValue can not be null");
            if (elemValue == value) {
                $(elem).attr('class', "toolbarPanelLinkSelectedLink");
            } else {
                $(elem).attr('class', "toolbarPanelLink");
            }
        });
        return panelElem;
    }
});
