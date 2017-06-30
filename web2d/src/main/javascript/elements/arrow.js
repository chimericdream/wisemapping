/* global define */
'use strict';

define(['element', 'toolkit'], (Element, Toolkit) => {
    class Arrow extends Element {
        constructor(attributes) {
            let peer = Toolkit.createArrow();
            let defaultAttributes = {'strokeColor': 'black', 'strokeWidth': 1, 'strokeStyle': 'solid', 'strokeOpacity': 1};
            for (let key in attributes) {
                if (!attributes.hasOwnProperty(key)) {
                    continue;
                }
                defaultAttributes[key] = attributes[key];
            }
            super(peer, defaultAttributes);
        }

        getType() {
            return 'Arrow';
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
