web2d.Font = new Class({
    initialize: function(fontFamily, textPeer) {
        var font = "web2d.peer.Toolkit.create" + fontFamily + "Font();";
        this._peer = eval(font);
        this._textPeer = textPeer;
    },

    getHtmlSize: function() {
        var scale = web2d.peer.utils.TransformUtil.workoutScale(this._textPeer);
        return this._peer.getHtmlSize(scale);
    },

    getGraphSize: function() {
        var scale = web2d.peer.utils.TransformUtil.workoutScale(this._textPeer);
        return this._peer.getGraphSize(scale);
    },

    getFontScale: function() {
        return web2d.peer.utils.TransformUtil.workoutScale(this._textPeer).height;
    },

    getSize: function() {
        return this._peer.getSize();
    },

    getStyle: function() {
        return this._peer.getStyle();
    },

    getWeight: function() {
        return this._peer.getWeight();
    },

    getFontFamily: function() {
        return this._peer.getFontFamily();
    },

    setSize: function(size) {
        return this._peer.setSize(size);
    },

    setStyle: function(style) {
        return this._peer.setStyle(style);
    },

    setWeight: function(weight) {
        return this._peer.setWeight(weight);
    },

    getFont: function() {
        return this._peer.getFont();
    },

    getWidthMargin: function() {
        return this._peer.getWidthMargin();
    }
});

web2d.Font.ARIAL = "Arial";
web2d.Font.TIMES = "Times";
web2d.Font.TAHOMA = "Tahoma";
web2d.Font.VERDANA = "Verdana";
