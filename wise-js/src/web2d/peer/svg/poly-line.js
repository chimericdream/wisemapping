/* global define, document */
'use strict';

define(['utils/is-defined', 'web2d/point', 'web2d/elements/poly-line', 'web2d/peer/svg/element'], ($defined, Point, PolyLineElement, ElementPeer) => {
    class PolyLinePeer extends ElementPeer {
        constructor() {
            super();
            this.init(document.createElementNS(ElementPeer.svgNamespace, 'polyline'));
            this.setFill('none');
            this.breakDistance = 10;
        }

        setFrom(x1, y1) {
            this._x1 = x1;
            this._y1 = y1;
            this._updatePath();
        }

        setTo(x2, y2) {
            this._x2 = x2;
            this._y2 = y2;
            this._updatePath();
        }

        setStrokeWidth(width) {
            this._native.setAttribute('stroke-width', width);
        }

        setColor(color) {
            this._native.setAttribute('stroke', color);
        }

        setStyle(style) {
            this._style = style;
            this._updatePath();
        }

        getStyle() {
            return this._style;
        }

        _updatePath() {
            if (this._style == 'Curved') {
                this._updateMiddleCurvePath();
            } else if (this._style == 'Straight') {
                this._updateStraightPath();
            } else {
                this._updateCurvePath();
            }
        }

        _updateStraightPath() {
            if ($defined(this._x1) && $defined(this._x2) && $defined(this._y1) && $defined(this._y2)) {
                let path = PolyLineElement.buildStraightPath(this.breakDistance, this._x1, this._y1, this._x2, this._y2);
                this._native.setAttribute('points', path);
            }
        }

        _updateMiddleCurvePath() {
            let x1 = this._x1,
                y1 = this._y1,
                x2 = this._x2,
                y2 = this._y2;

            if ($defined(x1) && $defined(x2) && $defined(y1) && $defined(y2)) {
                let diff = x2 - x1;
                let middlex = (diff / 2) + x1;
                let signx = 1;
                let signy = 1;

                if (diff < 0) {
                    signx = -1;
                }

                if (y2 < y1) {
                    signy = -1;
                }

                let path = x1 + ', ' + y1 + ' ' + (middlex - 10 * signx) + ', ' + y1 + ' ' + middlex + ', ' + (y1 + 10 * signy) + ' ' + middlex + ', ' + (y2 - 10 * signy) + ' ' + (middlex + 10 * signx) + ', ' + y2 + ' ' + x2 + ', ' + y2;
                this._native.setAttribute('points', path);
            }
        }

        _updateCurvePath() {
            if ($defined(this._x1) && $defined(this._x2) && $defined(this._y1) && $defined(this._y2)) {
                let path = PolyLineElement.buildCurvedPath(this.breakDistance, this._x1, this._y1, this._x2, this._y2);
                this._native.setAttribute('points', path);
            }
        }
    }

    return PolyLinePeer;
});
