web2d.peer.svg.LinePeer = new Class({
    Extends: web2d.peer.svg.ElementPeer,

    initialize: function() {
        var svgElement = window.document.createElementNS(this.svgNamespace, 'line');
        this.parent(svgElement);
        this.attachChangeEventListener("strokeStyle", web2d.peer.svg.ElementPeer.prototype.updateStrokeStyle);
    },

    setFrom: function(x1, y1) {
        this._x1 = x1;
        this._y1 = y1;
        this._native.setAttribute('x1', x1);
        this._native.setAttribute('y1', y1);
    },

    setTo: function(x2, y2) {
        this._x2 = x2;
        this._y2 = y2;
        this._native.setAttribute('x2', x2);
        this._native.setAttribute('y2', y2);
    },

    getFrom: function() {
        return new core.Point(this._x1, this._y1);
    },

    getTo: function() {
        return new core.Point(this._x2, this._y2);
    },

    /*
     * http://www.zvon.org/HowTo/Output/howto_jj_svg_27.html?at=marker-end
     */
    setArrowStyle: function(startStyle, endStyle) {
        if ($defined(startStyle)) {
            // Todo: This must be implemented ...
        }

        if ($defined(endStyle)) {
            // Todo: This must be implemented ...
        }
    }
});
