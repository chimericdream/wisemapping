mindplot.model.NoteModel = new Class(/** @lends NoteModel */{
    Extends: mindplot.model.FeatureModel,

    /**
     * @constructs
     * @param attributes
     * @extends mindplot.model.FeatureModel
     */
    initialize: function(attributes) {
        this.parent(mindplot.model.NoteModel.FEATURE_TYPE);
        var noteText = attributes.text ? attributes.text : " ";
        this.setText(noteText);
    },

    /** */
    getText: function() {
        return this.getAttribute('text');
    },

    /** */
    setText: function(text) {
        $assert(text, 'text can not be null');
        this.setAttribute('text', text);
    }
});

/**
 * @constant
 * @type {String}
 * @default
 */
mindplot.model.NoteModel.FEATURE_TYPE = "note";
