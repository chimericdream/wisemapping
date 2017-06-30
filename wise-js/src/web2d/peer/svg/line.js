/* global define, document */
'use strict';

define(['utils/is-defined', 'web2d/point', 'web2d/peer/svg/element'], ($defined, Point, ElementPeer) => {
    class LinePeer extends ElementPeer {
        constructor() {
            let svgElement = document.createElementNS(ElementPeer.svgNamespace, 'line');
            super(svgElement);
            this.attachChangeEventListener('strokeStyle', this.updateStrokeStyle);
        }

        setFrom(x1, y1) {
            this._x1 = x1;
            this._y1 = y1;
            this._native.setAttribute('x1', x1);
            this._native.setAttribute('y1', y1);
        }

        setTo(x2, y2) {
            this._x2 = x2;
            this._y2 = y2;
            this._native.setAttribute('x2', x2);
            this._native.setAttribute('y2', y2);
        }

        getFrom() {
            return new Point(this._x1, this._y1);
        }

        getTo() {
            return new Point(this._x2, this._y2);
        }

        /*
         * http://www.zvon.org/HowTo/Output/howto_jj_svg_27.html?at=marker-end
         */
        setArrowStyle(startStyle, endStyle) {
            if ($defined(startStyle)) {
                // Todo: This must be implemented ...
            }

            if ($defined(endStyle)) {
                // Todo: This must be implemented ...
            }
        }
    }

    return LinePeer;
});
