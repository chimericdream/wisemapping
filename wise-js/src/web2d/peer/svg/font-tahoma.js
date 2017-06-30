/* global define, document */
'use strict';

define(['utils/is-defined', 'web2d/font', 'web2d/peer/svg/font'], ($defined, Font, FontPeer) => {
    class TahomaFont extends FontPeer {
        constructor() {
            super();
            this._fontFamily = 'Tahoma';
        }

        getFontFamily() {
            return this._fontFamily;
        }

        getFont() {
            return Font.TAHOMA;
        }
    }

    return TahomaFont;
});
