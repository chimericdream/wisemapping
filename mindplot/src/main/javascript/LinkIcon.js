mindplot.LinkIcon = new Class({
    Extends: mindplot.Icon,

    initialize: function(topic, linkModel, readOnly) {
        $assert(topic, 'topic can not be null');
        $assert(linkModel, 'linkModel can not be null');

        this.parent(mindplot.LinkIcon.IMAGE_URL);
        this._linksModel = linkModel;
        this._topic = topic;
        this._readOnly = readOnly;

        this._registerEvents();
    },

    _registerEvents: function() {
        this._image.setCursor('pointer');
        this._tip = new mindplot.widget.LinkIconTooltip(this);

        var me = this;
        if (!this._readOnly) {
            // Add on click event to open the editor ...
            this.addEvent('click', function(event) {
                me._tip.hide();
                me._topic.showLinkEditor();
                event.stopPropagation();
            });
            //FIXME: we shouldn't have timeout of that..
            this.addEvent("mouseleave", function(event) {
                window.setTimeout(function() {
                    if (!$("#linkPopover:hover").length) {
                        me._tip.hide();
                    }
                    event.stopPropagation();
                }, 100)
            });
        }

        $(this.getImage()._peer._native).mouseenter(function() {
            me._tip.show();
        })
    },

    getModel: function() {
        return this._linksModel;
    }
});
mindplot.LinkIcon.IMAGE_URL = "images/links.png";

