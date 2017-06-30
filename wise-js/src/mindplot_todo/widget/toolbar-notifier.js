mindplot.widget.ToolbarNotifier = new Class({
    initialize: function() {
        this.container = $('#headerNotifier');
    },

    hide: function() {
        this.container.hide();
    },

    logMessage: function(msg, fade) {
        $assert(msg, 'msg can not be null');
        // In case of print,embedded no message is displayed ....
        if (this.container && !this.container.data('transitioning')) {
            this.container.data('transitioning', true);
            this.container.text(msg);
            this.container.css({top: "5px", left: ($(window).width() - this.container.width()) / 2 - 9});
            this.container.show().fadeOut(5000);
        }
        this.container.data('transitioning', false);
    }
});

var toolbarNotifier = new mindplot.widget.ToolbarNotifier();
$notify = function(msg) {
    toolbarNotifier.logMessage(msg);
};
