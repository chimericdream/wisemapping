/**
 * A group object can be used to collect shapes.
 */
web2d.Group = new Class({
    Extends: web2d.Element,

    initialize: function(attributes) {
        var peer = web2d.peer.Toolkit.createGroup();
        var defaultAttributes = {width: 50, height: 50, x: 50, y: 50, coordOrigin: '0 0', coordSize: '50 50'};
        for (var key in attributes) {
            defaultAttributes[key] = attributes[key];
        }
        this.parent(peer, defaultAttributes);
    },

    /**
     * Remove an element as a child to the object.
     */
    removeChild: function(element) {
        if (!$defined(element)) {
            throw "Child element can not be null";
        }

        if (element == this) {
            throw "It's not possible to add the group as a child of itself";
        }

        var elementType = element.getType();
        if (elementType == null) {
            throw "It seems not to be an element ->" + element;
        }

        this._peer.removeChild(element._peer);
    },

    /**
     * Appends an element as a child to the object.
     */
    append: function(element) {
        if (!$defined(element)) {
            throw "Child element can not be null";
        }

        if (element == this) {
            throw "It's not posible to add the group as a child of itself";
        }

        var elementType = element.getType();
        if (elementType == null) {
            throw "It seems not to be an element ->" + element;
        }

        if (elementType == "Workspace") {
            throw "A group can not have a workspace as a child";
        }

        this._peer.append(element._peer);
    },

    getType: function() {
        return "Group";
    },

    /**
     * The group element is a containing blocks for this content - they define a CSS2 "block level box".
     * Inside the containing block a local coordinate system is defined for any sub-elements using the coordsize and coordorigin attributes.
     * All CSS2 positioning information is expressed in terms of this local coordinate space.
     * Consequently CSS2 position attributes (left, top, width, height and so on) have no unit specifier -
     * they are simple numbers, not CSS length quantities.
     */
    setCoordSize: function(width, height) {
        this._peer.setCoordSize(width, height);
    },

    setCoordOrigin: function(x, y) {
        this._peer.setCoordOrigin(x, y);
    },

    getCoordOrigin: function() {
        return this._peer.getCoordOrigin();
    },
    getSize: function() {
        return this._peer.getSize();
    },

    setFill: function(color, opacity) {
        throw "Unsupported operation. Fill can not be set to a group";
    },

    setStroke: function(width, style, color, opacity) {
        throw "Unsupported operation. Stroke can not be set to a group";
    },

    getCoordSize: function() {
        return this._peer.getCoordSize();
    },

    appendDomChild: function(DomElement) {
        if (!$defined(DomElement)) {
            throw "Child element can not be null";
        }

        if (DomElement == this) {
            throw "It's not possible to add the group as a child of itself";
        }

        this._peer._native.append(DomElement);
    },

    setOpacity: function(value) {
        this._peer.setOpacity(value);
    }
});
