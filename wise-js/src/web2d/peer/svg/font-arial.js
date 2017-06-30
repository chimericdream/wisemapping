/* global define, document */
'use strict';

define(['utils/is-defined', 'web2d/font', 'web2d/peer/svg/font'], ($defined, Font, FontPeer) => {
    class ArialFont extends FontPeer {
        constructor() {
            super();
            this._fontFamily = 'Arial';
        }

        getFontFamily() {
            return this._fontFamily;
        }

        getFont() {
            return Font.ARIAL;
        }
    }

    return ArialFont;
});
