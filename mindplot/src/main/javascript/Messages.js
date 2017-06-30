mindplot.Messages = new Class({
    Static: {
        init: function(locale) {
            locale = $defined(locale) ? locale : 'en';
            var bundle = mindplot.Messages.BUNDLES[locale];
            if (bundle == null && locale.indexOf("_") != -1) {
                // Try to locate without the specialization ...
                locale = locale.substring(0, locale.indexOf("_"));
                bundle = mindplot.Messages.BUNDLES[locale];
            }
            mindplot.Messages.__bundle = bundle;
        }
    }
});

$msg = function(key) {
    if (!mindplot.Messages.__bundle) {
        mindplot.Messages.init('en');
    }

    var msg = mindplot.Messages.__bundle[key];
    return msg ? msg : key;
};

mindplot.Messages.BUNDLES = {};
