/* global define, document */
'use strict';

define(['utils/is-defined', 'web2d/font', 'web2d/peer/svg/font'], ($defined, Font, FontPeer) => {
    class VerdanaFont extends FontPeer {
        constructor() {
            super();
            this._fontFamily = 'Verdana';
        }

        getFontFamily() {
            return this._fontFamily;
        }

        getFont() {
            return Font.VERDANA;
        }
    }

    return VerdanaFont;
});
