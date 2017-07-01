/* global define */
'use strict';

define(['element', 'toolkit'], (Element, Toolkit) => {
    class Rect extends Element {
        static get TYPE() {
            return 'Rect';
        }

        static get defaults() {
            return {
                'width': 40,
                'height': 40,
                'x': 5,
                'y': 5,
                'stroke': '1px solid black',
                'fillColor': 'green'
            };
        }

        constructor(arc, params) {
            super();

            if (arc && arc > 1) {
                throw 'Arc must be 0 <= arc <= 1';
            }

            this.init(Toolkit.createRect(arc), this._initializeAttributes(this.defaults, params));
        }

        getSize() {
            return this._peer.getSize();
        }
    }

    return Rect;
});
