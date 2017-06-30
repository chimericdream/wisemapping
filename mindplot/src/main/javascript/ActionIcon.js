mindplot.ActionIcon = new Class({
    Extends: mindplot.Icon,

    initialize: function(topic, url) {
        this.parent(url);
        this._node = topic;
    },

    getNode: function() {
        return this._node;
    },

    setPosition: function(x, y) {
        var size = this.getSize();
        this.getImage().setPosition(x - size.width / 2, y - size.height / 2);
    },

    addEvent: function(event, fn) {
        this.getImage().addEvent(event, fn);
    },

    addToGroup: function(group) {
        group.append(this.getImage());
    },

    setVisibility: function(visible) {
        this.getImage().setVisibility(visible);
    },

    isVisible: function() {
        return this.getImage().isVisible();
    },

    setCursor: function(cursor) {
        return this.getImage().setCursor(cursor);
    },

    moveToBack: function(cursor) {
        return this.getImage().moveToBack(cursor);
    },

    moveToFront: function(cursor) {
        return this.getImage().moveToFront(cursor);
    }
});
