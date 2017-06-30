web2d.peer.svg.ImagePeer = new Class({
    Extends: web2d.peer.svg.ElementPeer,

    initialize: function() {
        var svgElement = window.document.createElementNS(this.svgNamespace, 'image');
        this.parent(svgElement);
        this._position = {x:0,y:0};
        this._href = "";
        this._native.setAttribute("preserveAspectRatio", "none");
    },

    setPosition: function(x, y) {
        this._position = {x:x, y:y};
        this._native.setAttribute('y', y);
        this._native.setAttribute('x', x);
    },

    getPosition: function() {
        return this._position;
    },

    setHref: function(url) {
        this._native.setAttributeNS(this.linkNamespace, "href", url);
        this._href = url;
    },

    getHref: function() {
        return this._href;
    }
});
