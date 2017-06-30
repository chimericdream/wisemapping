web2d.peer.svg.ArrowPeer = new Class({
    Extends: web2d.peer.svg.ElementPeer,

    initialize: function() {
        var svgElement = window.document.createElementNS(this.svgNamespace, 'path');
        this.parent(svgElement);
        this._style = {};
        this._controlPoint = new core.Point();
        this._fromPoint = new core.Point();
    },

    setFrom: function(x, y) {
        this._fromPoint.x = x;
        this._fromPoint.y = y;
        this._redraw();
    },

    setControlPoint: function(point) {
        this._controlPoint = point;
        this._redraw();
    },

    setStrokeColor: function(color) {
        this.setStroke(null, null, color, null);
    },

    setStrokeWidth: function(width) {
        this.setStroke(width);
    },

    setDashed: function(isDashed, length, spacing) {
        if ($defined(isDashed) && isDashed && $defined(length) && $defined(spacing)) {
            this._native.setAttribute("stroke-dasharray", length + "," + spacing);
        } else {
            this._native.setAttribute("stroke-dasharray", "");
        }
    },

    _updateStyle: function() {
        var style = "";
        for (var key in this._style) {
            style += key + ":" + this._style[key] + " ";
        }
        this._native.setAttribute("style", style);
    },

    _redraw: function() {
        var x,y, xp, yp;
        if ($defined(this._fromPoint.x) && $defined(this._fromPoint.y) && $defined(this._controlPoint.x) && $defined(this._controlPoint.y)) {

            if (this._controlPoint.y == 0)
                this._controlPoint.y = 1;

            var y0 = this._controlPoint.y;
            var x0 = this._controlPoint.x;
            var x2 = x0 + y0;
            var y2 = y0 - x0;
            var x3 = x0 - y0;
            var y3 = y0 + x0;
            var m = y2 / x2;
            var mp = y3 / x3;
            var l = 6;
            var pow = Math.pow;
            x = (x2 == 0 ? 0 : Math.sqrt(pow(l, 2) / (1 + pow(m, 2))));
            x *= Math.sign(x2);
            y = (x2 == 0 ? l * Math.sign(y2) : m * x);
            xp = (x3 == 0 ? 0 : Math.sqrt(pow(l, 2) / (1 + pow(mp, 2))));
            xp *= Math.sign(x3);
            yp = (x3 == 0 ? l * Math.sign(y3) : mp * xp);

            var path = "M" + this._fromPoint.x + "," + this._fromPoint.y + " "
                + "L" + (x + this._fromPoint.x) + "," + (y + this._fromPoint.y)
                + "M" + this._fromPoint.x + "," + this._fromPoint.y + " "
                + "L" + (xp + this._fromPoint.x) + "," + (yp + this._fromPoint.y)
                ;
            this._native.setAttribute("d", path);
        }
    }
});
