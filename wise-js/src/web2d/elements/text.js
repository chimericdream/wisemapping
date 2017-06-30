web2d.Text = new Class({
    Extends: web2d.Element,

    initialize: function(attributes) {
        var peer = web2d.peer.Toolkit.createText();
        this.parent(peer, attributes);
    },

    getType: function() {
        return "Text";
    },

    setText: function(text) {
        this._peer.setText(text);
    },

    setTextAlignment: function(align) {
        $assert(align, "align can not be null");
        this._peer.setTextAlignment(align);
    },

    setTextSize: function(width, height) {
        this._peer.setContentSize(width, height);
    },

    getText: function() {
        return this._peer.getText();
    },

    setFont: function(font, size, style, weight) {
        this._peer.setFont(font, size, style, weight);
    },

    setColor: function(color) {
        this._peer.setColor(color);
    },

    getColor: function() {
        return this._peer.getColor();
    },

    setStyle: function(style) {
        this._peer.setStyle(style);
    },

    setWeight: function(weight) {
        this._peer.setWeight(weight);
    },

    setFontFamily: function(family) {
        this._peer.setFontFamily(family);
    },

    getFont: function() {
        return this._peer.getFont();
    },

    setSize: function(size) {
        this._peer.setSize(size);
    },

    getHtmlFontSize: function() {
        return this._peer.getHtmlFontSize();
    },

    getWidth: function() {
        return this._peer.getWidth();
    },

    getHeight: function() {
        return parseInt(this._peer.getHeight());
    },

    getFontHeight: function() {
        var lines = this._peer.getText().split('\n').length;
        return Math.round(this.getHeight() / lines);
    }
});
