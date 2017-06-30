mindplot.widget.FontFamilyPanel = new Class({
    Extends: mindplot.widget.ListToolbarPanel,

    initialize: function(buttonId, model) {
        this.parent(buttonId, model);
    },

    buildPanel: function() {
        var content = $("<div class='toolbarPanel' id='fontFamilyPanel'></div>");
        content.html(
            '<div id="times" model="Times" class="toolbarPanelLink" style="font-family:times;">Times</div>' +
            '<div id="arial"  model="Arial" style="font-family:arial;">Arial</div>' +
            '<div id="tahoma" model="Tahoma" style="font-family:tahoma;">Tahoma</div>' +
            '<div id="verdana" model="Verdana" style="font-family:verdana;">Verdana</div>'
        );
        return content;
    }
});
