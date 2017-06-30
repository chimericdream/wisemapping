/* global define, document */
'use strict';

define(['utils/is-defined', 'web2d/font', 'web2d/peer/svg/font'], ($defined, Font, FontPeer) => {
    class TimesFont extends FontPeer {
        constructor() {
            super();
            this._fontFamily = 'Times';
        }

        getFontFamily() {
            return this._fontFamily;
        }

        getFont() {
            return Font.TIMES;
        }
    }

    return TimesFont;
});
