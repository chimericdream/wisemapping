//FIXME: this Class should be reimplemented
mindplot.util.FadeEffect = new Class(/** @lends FadeEffect */{
    Extends: mindplot.Events,

    /**
     * @extends mindplot.Events
     * @constructs
     * @param elements
     * @param isVisible
     */
    initialize: function(elements, isVisible) {
        this._isVisible = isVisible;
        this._element = elements;
    },

    /** */
    start: function(){
        var visible = this._isVisible;
        _.each(this._element, function(elem) {
            if(elem){
                elem.setVisibility(visible);
            }
        });
        this._isVisible = !visible;
        this.fireEvent('complete');
    }
});
