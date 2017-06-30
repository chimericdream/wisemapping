web2d.peer.svg.TahomaFont = new Class({
    Extends: web2d.peer.svg.Font,

    initialize: function() {
        this.parent();
        this._fontFamily = "tahoma";
    },

    getFontFamily: function() {
        return this._fontFamily;
    },

    getFont: function() {
        return web2d.Font.TAHOMA;
    }
});
