/* global define */
'use strict';

define(['element', 'toolkit'], (Element, Toolkit) => {
    class Ellipse extends Element {
        static get TYPE() {
            return 'Ellipse';
        }

        static get defaults() {
            return {
                'width': 40,
                'height': 40,
                'x': 5,
                'y': 5,
                'stroke': '1 solid black',
                'fillColor': 'blue'
            };
        }

        constructor(params) {
            super(Toolkit.createElipse(), this._initializeAttributes(this.defaults, params));
        }

        getSize() {
            return this._peer.getSize();
        }
    }

    return Ellipse;
});
