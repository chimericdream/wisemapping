mindplot.widget.FontSizePanel = new Class({
    Extends: mindplot.widget.ListToolbarPanel,

    initialize: function(buttonId, model) {
        this.parent(buttonId, model);
    },

    buildPanel: function() {
        var content = $("<div class='toolbarPanel' id='fontSizePanel'></div>");
        content[0].innerHTML = '' +
            '<div id="small" model="6" style="font-size:8px">Small</div>' +
            '<div id="normal" model="8" style="font-size:12px">Normal</div>' +
            '<div id="large" model="10" style="font-size:15px">Large</div>' +
            '<div id="huge"  model="15" style="font-size:24px">Huge</div>';

        return content;
    }
});
