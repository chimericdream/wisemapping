core.Point = new Class({
    /**
     * @constructs
     * @param {Number} x coordinate
     * @param {Number} y coordinate
     */
    initialize: function(x, y) {
        this.x = x;
        this.y = y;
    },

    /**
     * @param {Number} x coordinate
     * @param {Number} y coordinate
     */
    setValue: function(x, y) {
        this.x = x;
        this.y = y;
    },

    inspect: function() {
        return "{x:" + this.x + ",y:" + this.y + "}";
    },

    clone: function() {
        return new core.Point(this.x, this.y);
    }

});

core.Point.fromString = function(point) {
    var values = point.split(',');
    return new core.Point(values[0], values[1]);
};
