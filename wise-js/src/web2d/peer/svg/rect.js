/* global define, document */
'use strict';

define(['utils/is-defined', 'web2d/peer/svg/element'], ($defined, ElementPeer) => {
    class RectPeer extends ElementPeer {
        constructor(arc) {
            let svgElement = document.createElementNS(ElementPeer.svgNamespace, 'rect');
            super(svgElement);
            this._arc = arc;
            this.attachChangeEventListener('strokeStyle', this.updateStrokeStyle);
        }

        setPosition(x, y) {
            if ($defined(x)) {
                this._native.setAttribute('x', parseInt(x));
            }
            if ($defined(y)) {
                this._native.setAttribute('y', parseInt(y));
            }
        }

        getPosition() {
            let x = this._native.getAttribute('x');
            let y = this._native.getAttribute('y');
            return {'x': parseInt(x), 'y': parseInt(y)};
        }

        setSize(width, height) {
            super.setSize(width, height);

            let min = width < height ? width : height;
            if ($defined(this._arc)) {
                // Transform percentages to SVG format.
                let arc = (min / 2) * this._arc;
                this._native.setAttribute('rx', arc);
                this._native.setAttribute('ry', arc);
            }
        }
    }

    return RectPeer;
});
