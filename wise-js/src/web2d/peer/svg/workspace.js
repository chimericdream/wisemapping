web2d.peer.svg.WorkspacePeer = new Class({
    Extends: web2d.peer.svg.ElementPeer,

    initialize: function(element) {
        this._element = element;
        var svgElement = window.document.createElementNS(this.svgNamespace, 'svg');
        this.parent(svgElement);
        this._native.setAttribute("focusable", "true");
        this._native.setAttribute("id", "workspace");
        this._native.setAttribute("preserveAspectRatio", "none");
    },

    /**
     * http://www.w3.org/TR/SVG/coords.html 7.7 The viewBox  attribute
     * It is often desirable to specify that a given set of graphics stretch to fit a particular container element. The viewBox attribute provides this capability.
     *
     * All elements that establish a new viewport (see elements that establish viewports), plus the 'marker', 'pattern' and 'view' elements have attribute viewBox. The value of the viewBox attribute is a list of four numbers <min-x>, <min-y>, <width> and <height>, separated by whitespace and/or a comma, which specify a rectangle in user space which should be mapped to the bounds of the viewport established by the given element, taking into account attribute preserveAspectRatio. If specified, an additional transformation is applied to all descendants of the given element to achieve the specified effect.
     *
     * A negative value for <width> or <height> is an error (see Error processing). A value of zero disables rendering of the element.
     *
     */
    setCoordSize: function(width, height) {
        var viewBox = this._native.getAttribute('viewBox');
        var coords = [0, 0, 0, 0];
        if (viewBox != null) {
            coords = viewBox.split(/ /);
        }
        if ($defined(width)) {
            coords[2] = width;
        }

        if ($defined(height)) {
            coords[3] = height;
        }

        this._native.setAttribute('viewBox', coords.join(" "));
        this._native.setAttribute("preserveAspectRatio", "none");
        web2d.peer.utils.EventUtils.broadcastChangeEvent(this, "strokeStyle");
    },

    getCoordSize: function() {
        var viewBox = this._native.getAttribute('viewBox');
        var coords = [1, 1, 1, 1];
        if (viewBox != null) {
            coords = viewBox.split(/ /);
        }
        return {width: coords[2], height: coords[3]};
    },

    setCoordOrigin: function(x, y) {
        var viewBox = this._native.getAttribute('viewBox');

        // ViewBox min-x ,min-y by default initializated with 0 and 0.
        var coords = [0, 0, 0, 0];
        if (viewBox != null) {
            coords = viewBox.split(/ /);
        }

        if ($defined(x)) {
            coords[0] = x;
        }

        if ($defined(y)) {
            coords[1] = y;
        }

        this._native.setAttribute('viewBox', coords.join(" "));
    },

    append: function(child) {
        this.parent(child);
        web2d.peer.utils.EventUtils.broadcastChangeEvent(child, "onChangeCoordSize");
    },

    getCoordOrigin: function(child) {
        var viewBox = this._native.getAttribute('viewBox');
        var coords = [1, 1, 1, 1];
        if (viewBox != null) {
            coords = viewBox.split(/ /);
        }
        var x = parseFloat(coords[0]);
        var y = parseFloat(coords[1]);
        return {x: x, y: y};
    },

    getPosition: function() {
        return {x: 0, y: 0};
    }
});
