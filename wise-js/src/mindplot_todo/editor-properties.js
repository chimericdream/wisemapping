mindplot.EditorProperties = new Class({
    initialize: function() {
        this._zoom = 0;
        this._position = 0;
    },

    setZoom: function(zoom) {
        this._zoom = zoom;
    },

    getZoom: function() {
        return this._zoom;
    },

    asProperties: function() {
        return "zoom=" + this._zoom + "\n";
    }
});
