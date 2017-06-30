mindplot.widget.TopicShapePanel = new Class({
    Extends: mindplot.widget.ListToolbarPanel,

    initialize: function(buttonId, model) {
        this.parent(buttonId, model);
    },

    buildPanel: function() {
        var content = $("<div class='toolbarPanel' id='topicShapePanel'></div>");
        content[0].innerHTML = '' +
            '<div id="rectagle" model="rectagle"><img src="images/shape-rectangle.png" alt="Rectangle"></div>' +
            '<div id="rounded_rectagle" model="rounded rectagle" ><img src="images/shape-rectangle-round.png" alt="Rounded Rectangle"></div>' +
            '<div id="line" model="line"><img src="images/shape-line.png" alt="Line"></div>' +
            '<div id="elipse" model="elipse"><img src="images/shape-circle.png"></div>';

        return content;
    }
});
