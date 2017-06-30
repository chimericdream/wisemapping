/* global define, document */
'use strict';

define(['utils/is-defined'], ($defined) => {
    class FontPeer {
        constructor() {
            this._size = 10;
            this._style = 'normal';
            this._weight = 'normal';
        }

        init(args) {
            if ($defined(args.size)) {
                this._size = parseInt(args.size);
            }
            if ($defined(args.style)) {
                this._style = args.style;
            }
            if ($defined(args.weight)) {
                this._weight = args.weight;
            }
        }

        getHtmlSize(scale) {
            let result = 0;
            if (this._size == 6) {
                result = this._size * scale.height * 43 / 32;
            }
            if (this._size == 8) {
                result = this._size * scale.height * 42 / 32;
            }
            else if (this._size == 10) {
                result = this._size * scale.height * 42 / 32;
            }
            else if (this._size == 15) {
                result = this._size * scale.height * 42 / 32;
            }

            return result;
        }

        getGraphSize() {
            return this._size * 43 / 32;
        }

        getSize() {
            return parseInt(this._size);
        }

        getStyle() {
            return this._style;
        }

        getWeight() {
            return this._weight;
        }

        setSize(size) {
            this._size = size;
        }

        setStyle(style) {
            this._style = style;
        }

        setWeight(weight) {
            this._weight = weight;
        }

        getWidthMargin() {
            let result = 0;
            if (this._size == 10 || this._size == 6) {
                result = 4;
            }
            return result;
        }
    }

    return FontPeer;
});
