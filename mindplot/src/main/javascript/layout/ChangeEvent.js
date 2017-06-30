mindplot.layout.ChangeEvent = new Class(/** @lends ChangeEvent */{
    /**
     * @constructs
     * @param {} id
     * @throws will throw an error if the given id is not/cannot be converted to a numerical value
     */
    initialize: function(id) {
        $assert(!isNaN(id), "id can not be null");
        this._id = id;
        this._position = null;
        this._order = null;
    },

    /** @return id */
    getId: function() {
        return this._id;
    },

    /** @return order */
    getOrder: function() {
        return this._order;
    },

    /** @return position */
    getPosition: function() {
        return this._position;
    },

    /**
     * @param {} value the order to set
     * @throws will throw an error if the given parameter is not/cannot be converted to a numerical
     * value
     */
    setOrder: function(value) {
        $assert(!isNaN(value), "value can not be null");
        this._order = value;
    },

    /** @param {} value
     *  @throws will throw an error if the value is null or undefined*/
    setPosition: function(value) {
        $assert(value, "value can not be null");
        this._position = value;
    },

    /** @return {String} order and position */
    toString: function() {
        return "[order:" + this.getOrder() + ", position: {" + this.getPosition().x + "," + this.getPosition().y + "}]";
    }
});
