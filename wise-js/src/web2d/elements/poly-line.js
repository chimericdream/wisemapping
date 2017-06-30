/* global define */
'use strict';

define(['element', 'toolkit'], (Element, Toolkit) => {
    class PolyLine extends Element {
        static get TYPE() {
            return 'PolyLine';
        }

        static get defaults() {
            return {
                'strokeColor': 'blue',
                'strokeWidth': 1,
                'strokeStyle': 'solid',
                'strokeOpacity': 1
            };
        }

        constructor(params) {
            super(Toolkit.createPolyLine(), this._initializeAttributes(this.defaults, params));
        }

        setFrom(x, y) {
            this._peer.setFrom(x, y);
        }

        setTo(x, y) {
            this._peer.setTo(x, y);
        }

        setStyle(style) {
            this._peer.setStyle(style);
        }

        getStyle() {
            return this._peer.getStyle();
        }

        buildCurvedPath(dist, x1, y1, x2, y2) {
            let signx = 1;
            let signy = 1;
            if (x2 < x1) {
                signx = -1;
            }
            if (y2 < y1) {
                signy = -1;
            }

            let path;
            if (Math.abs(y1 - y2) > 2) {
                let middlex = x1 + ((x2 - x1 > 0) ? dist : -dist);
                path = x1.toFixed(1) + ', ' + y1.toFixed(1) + ' ' + middlex.toFixed(1) + ', ' + y1.toFixed(1) + ' ' + middlex.toFixed(1) + ', ' + (y2 - 5 * signy).toFixed(1) + ' ' + (middlex + 5 * signx).toFixed(1) + ', ' + y2.toFixed(1) + ' ' + x2.toFixed(1) + ', ' + y2.toFixed(1);
            } else {
                path = x1.toFixed(1) + ', ' + y1.toFixed(1) + ' ' + x2.toFixed(1) + ', ' + y2.toFixed(1);
            }

            return path;
        }

        buildStraightPath(dist, x1, y1, x2, y2) {
            let middlex = x1 + ((x2 - x1 > 0) ? dist : -dist);
            return  x1 + ', ' + y1 + ' ' + middlex + ', ' + y1 + ' ' + middlex + ', ' + y2 + ' ' + x2 + ', ' + y2;
        }
    }

    return PolyLine;
});
