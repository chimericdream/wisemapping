web2d.peer.svg.ArialFont = new Class({
    Extends: web2d.peer.svg.Font,

    initialize: function() {
        this.parent();
        this._fontFamily = "Arial";
    },

    getFontFamily: function() {
        return this._fontFamily;
    },

    getFont: function() {
        return web2d.Font.ARIAL;
    }
});
