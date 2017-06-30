mindplot.model.FeatureModel = new Class(/** @lends FeatureModel */{
    Static: {
        _nextUUID: function() {
            if (!$defined(mindplot.model.FeatureModel._uuid)) {
                mindplot.model.FeatureModel._uuid = 0;
            }

            mindplot.model.FeatureModel._uuid = mindplot.model.FeatureModel._uuid + 1;
            return mindplot.model.FeatureModel._uuid;
        }
    },

    /**
     * @constructs
     * @param type
     * @throws will throw an exception if type is null or undefined
     * assigns a unique id and the given type to the new model
     */
    initialize: function(type) {
        $assert(type, 'type can not be null');
        this._id = mindplot.model.FeatureModel._nextUUID();

        this._type = type;
        this._attributes = {};

        // Create type method ...
        this['is' + $.camelCase(type) + 'Model'] = function() {
            return true;
        };
    },

    /** */
    getAttributes: function() {
        return Object.clone(this._attributes);
    },

    /** */
    setAttributes: function(attributes) {
        for (key in attributes) {
            this["set" + key.capitalize()](attributes[key]);
        }
    },

    /** */
    setAttribute: function(key, value) {
        $assert(key, 'key id can not be null');
        this._attributes[key] = value;
    },

    /** */
    getAttribute: function(key) {
        $assert(key, 'key id can not be null');

        return this._attributes[key];
    },

    /** */
    getId: function() {
        return this._id;
    },

    /** */
    setId: function(id) {
        this._id = id;
    },

    /** */
    getType: function() {
        return this._type;
    }
});
