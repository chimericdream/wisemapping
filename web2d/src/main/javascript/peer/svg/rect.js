/**
 * http://www.w3.org/TR/SVG/shapes.html#RectElement
 */
web2d.peer.svg.RectPeer = new Class({
    Extends: web2d.peer.svg.ElementPeer,

    initialize: function(arc) {
        var svgElement = window.document.createElementNS(this.svgNamespace, 'rect');
        this.parent(svgElement);
        this._arc = arc;
        this.attachChangeEventListener("strokeStyle", web2d.peer.svg.ElementPeer.prototype.updateStrokeStyle);
    },

    setPosition: function(x, y) {
        if ($defined(x)) {
            this._native.setAttribute('x', parseInt(x));
        }
        if ($defined(y)) {
            this._native.setAttribute('y', parseInt(y));
        }
    },

    getPosition: function() {
        var x = this._native.getAttribute('x');
        var y = this._native.getAttribute('y');
        return {x:parseInt(x),y:parseInt(y)};
    },

    setSize: function(width, height) {
        this.parent(width, height);

        var min = width < height ? width : height;
        if ($defined(this._arc)) {
            // Transform percentages to SVG format.
            var arc = (min / 2) * this._arc;
            this._native.setAttribute('rx', arc);
            this._native.setAttribute('ry', arc);
        }
    }
});
