mindplot.Icon = new Class({
    initialize: function(url) {
        $assert(url, 'topic can not be null');
        this._image = new web2d.Image();
        this._image.setHref(url);
        this._image.setSize(mindplot.Icon.SIZE, mindplot.Icon.SIZE);
    },

    getImage: function() {
        return this._image;
    },

    setGroup: function(group) {
        this._group = group;
    },

    getGroup: function() {
        return this._group;
    },

    getSize: function() {
        return this._image.getSize();
    },

    getPosition: function() {
        return this._image.getPosition();
    },

    addEvent: function(type, fnc) {
        this._image.addEvent(type, fnc);
    },

    remove: function() {
        throw "Unsupported operation";
    }
});

mindplot.Icon.SIZE = 90;
