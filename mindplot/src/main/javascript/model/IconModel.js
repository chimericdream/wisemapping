mindplot.model.IconModel = new Class(/** @lends IconModel */{
    Extends: mindplot.model.FeatureModel,

    /**
     * @constructs
     * @param attributes
     * @extends mindplot.model.FeatureModel
     */
    initialize: function(attributes) {
        this.parent(mindplot.model.IconModel.FEATURE_TYPE);
        this.setIconType(attributes.id);
    },

    /** @return the icon type id */
    getIconType: function() {
        return this.getAttribute('id');
    },

    /** @param {String} iconType the icon type id*/
    setIconType: function(iconType) {
        $assert(iconType, 'iconType id can not be null');
        this.setAttribute('id', iconType);
    }
});

/**
 * @constant
 * @type {String}
 * @default
 */
mindplot.model.IconModel.FEATURE_TYPE = "icon";
