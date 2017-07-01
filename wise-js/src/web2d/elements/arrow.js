/* global define */
'use strict';

define(['element', 'toolkit'], (Element, Toolkit) => {
    class Arrow extends Element {
        static get TYPE() {
            return 'Arrow';
        }

        static get defaults() {
            return {
                'strokeColor': 'black',
                'strokeWidth': 1,
                'strokeStyle': 'solid',
                'strokeOpacity': 1
            };
        }

        constructor(params) {
            super();
            this.init(Toolkit.createArrow(), this._initializeAttributes(this.defaults, params));
        }

        setFrom(x, y) {
            this._peer.setFrom(x, y);
        }

        setControlPoint(point) {
            this._peer.setControlPoint(point);
        }

        setStrokeColor(color) {
            this._peer.setStrokeColor(color);
        }

        setStrokeWidth(width) {
            this._peer.setStrokeWidth(width);
        }

        setDashed(isDashed, length, spacing) {
            this._peer.setDashed(isDashed, length, spacing);
        }
    }

    return Arrow;
});
