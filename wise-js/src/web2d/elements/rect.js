/**
 * Create a rectangle and variations of a rectangle shape.
 * arc must be specified to create rounded rectangles.
 * arc = "<length>"
 *     For rounded rectangles, radius of the ellipse used to round off the corners of the rectangle.
 */
web2d.Rect = new Class({
    Extends: web2d.Element,

    initialize: function(arc, attributes) {
        if (arc && arc > 1) {
            throw "Arc must be 0<=arc<=1";
        }

        if (arguments.length <= 0) {
            var rx = 0;
            var ry = 0;
        }

        var peer = web2d.peer.Toolkit.createRect(arc);
        var defaultAttributes = {width: 40, height: 40, x: 5, y: 5, stroke: '1 solid black', fillColor: 'green'};
        for (var key in attributes) {
            defaultAttributes[key] = attributes[key];
        }
        this.parent(peer, defaultAttributes);
    },

    getType: function() {
        return "Rect";
    },

    getSize: function() {
        return this._peer.getSize();
    }
});
