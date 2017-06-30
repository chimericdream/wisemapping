web2d.peer.svg.VerdanaFont = new Class({
    Extends: web2d.peer.svg.Font,

    initialize: function() {
        this.parent();
        this._fontFamily = "verdana";
    },

    getFontFamily: function() {
        return this._fontFamily;
    },

    getFont: function() {
        return web2d.Font.VERDANA;
    }
});
