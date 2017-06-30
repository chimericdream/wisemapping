web2d.Image = new Class({
    Extends: web2d.Element,

    initialize: function(attributes) {
        var peer = web2d.peer.Toolkit.createImage();
        this.parent(peer, attributes);
    },

    getType: function() {
        return "Image";
    },

    setHref: function(href) {
        this._peer.setHref(href);
    },

    getHref: function() {
        return this._peer.getHref();
    },

    getSize: function() {
        return this._peer.getSize();
    }
});
