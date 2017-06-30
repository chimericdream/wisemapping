web2d.peer.svg.TimesFont = new Class({
    Extends: web2d.peer.svg.Font,

    initialize: function() {
        this.parent();
        this._fontFamily = "times";
    },

    getFontFamily: function() {
        return this._fontFamily;
    },

    getFont: function() {
        return web2d.Font.TIMES;
    }
});
