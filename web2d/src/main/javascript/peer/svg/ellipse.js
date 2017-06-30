web2d.peer.svg.ElipsePeer = new Class({
    Extends: web2d.peer.svg.ElementPeer,

    initialize: function() {
        var svgElement = window.document.createElementNS(this.svgNamespace, 'ellipse');
        this.parent(svgElement);
        this.attachChangeEventListener("strokeStyle", web2d.peer.svg.ElementPeer.prototype.updateStrokeStyle);
        this._position = {x:0, y:0};
    },

     setSize: function(width, height) {
        this.parent(width, height);
        if ($defined(width)) {
            this._native.setAttribute('rx', width / 2);
        }

        if ($defined(height)) {
            this._native.setAttribute('ry', height / 2);
        }

        var pos = this.getPosition();
        this.setPosition(pos.x, pos.y);
    },

    setPosition: function(cx, cy) {
        var size = this.getSize();
        cx = cx + size.width / 2;
        cy = cy + size.height / 2;
        if ($defined(cx)) {
            this._native.setAttribute('cx', cx);
        }

        if ($defined(cy)) {
            this._native.setAttribute('cy', cy);
        }
    },

    getPosition: function() {
        return this._position;
    }
});
