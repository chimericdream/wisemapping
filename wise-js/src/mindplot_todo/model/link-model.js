mindplot.model.LinkModel = new Class(/** @lends LinkModel */{
    Extends: mindplot.model.FeatureModel,

    /**
     * @constructs
     * @param attributes
     * @extends mindplot.model.FeatureModel
     */
    initialize: function(attributes) {
        this.parent(mindplot.model.LinkModel.FEATURE_TYPE);
        this.setUrl(attributes.url);
    },

    /** @return {String} the url attribute value */
    getUrl: function() {
        return this.getAttribute('url');
    },

    /**
     * @param {String} url a URL provided by the user to set the link to
     * @throws will throw an error if url is null or undefined
     */
    setUrl: function(url) {
        $assert(url, 'url can not be null');

        var fixedUrl = this._fixUrl(url);
        this.setAttribute('url', fixedUrl);

        var type = fixedUrl.contains('mailto:') ? 'mail' : 'url';
        this.setAttribute('urlType', type);
    },

    //url format is already checked in LinkEditor.checkUrl
    _fixUrl: function(url) {
        var result = url;
        if (!result.contains('http://') && !result.contains('https://') && !result.contains('mailto://')) {
            result = "http://" + result;
        }
        return result;
    },

    /**
     * @param {String} urlType the url type, either 'mail' or 'url'
     * @throws will throw an error if urlType is null or undefined
     */
    setUrlType: function(urlType) {
        $assert(urlType, 'urlType can not be null');
        this.setAttribute('urlType', urlType);
    }
});

/**
 * @constant
 * @type {String}
 * @default
 */
mindplot.model.LinkModel.FEATURE_TYPE = 'link';
