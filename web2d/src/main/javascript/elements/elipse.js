web2d.Elipse = new Class({
    Extends: web2d.Element,

    initialize: function(attributes) {
        var peer = web2d.peer.Toolkit.createElipse();
        var defaultAttributes = {width: 40, height: 40, x: 5, y: 5, stroke: '1 solid black', fillColor: 'blue'};
        for (var key in attributes) {
            defaultAttributes[key] = attributes[key];
        }
        this.parent(peer, defaultAttributes);
    },

    getType: function() {
        return "Elipse";
    },

    getSize: function() {
        return this._peer.getSize();
    }
});
