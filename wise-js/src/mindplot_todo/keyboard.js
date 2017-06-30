mindplot.Keyboard = new Class({
    initialize: function() {
    },

    addShortcut: function(shortcuts, callback) {
        if (!$.isArray(shortcuts)) {
            shortcuts = [shortcuts];
        }
        _.each(shortcuts, function(shortcut) {
            $(document).bind('keydown', shortcut, callback);
        });
    }
});
