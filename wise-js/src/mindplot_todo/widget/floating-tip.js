mindplot.widget.FloatingTip = new Class({
    Implements: [Options, mindplot.Events],

    options: {
        animation: true,
        html: false,
        placement: 'right',
        selector: false,
        trigger: 'hover',
        title: '',
        content: '',
        delay: 0,
        container: false,
        destroyOnExit: false
    },

    initialize: function(element, options) {
        this.setOptions(options);
        this.element = element;
        this._createPopover();
    },

    //FIXME: find a better way to do that...
    _createPopover: function() {
        this.element.popover(this.options);
        var me = this;
        if (this.options.destroyOnExit) {
            this.element.one('hidden.bs.popover', function() {
                me.element.popover('destroy');
                me._createPopover();
            });
        }
    },

    show: function() {
        this.element.popover('show');
        this.fireEvent('show');
        return this;
    },

    hide: function() {
        this.element.popover('hide');
        this.fireEvent('hide');
        return this;
    }
});
