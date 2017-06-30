/* global define, document */
'use strict';

define(['utils/is-defined', 'web2d/point', 'web2d/peer/svg/element'], ($defined, Point, ElementPeer) => {
    class ArrowPeer extends ElementPeer {
        constructor() {
            let svgElement = document.createElementNS(ElementPeer.svgNamespace, 'path');
            super(svgElement);
            this._style = {};
            this._controlPoint = new Point();
            this._fromPoint = new Point();
        }

        setFrom(x, y) {
            this._fromPoint.x = x;
            this._fromPoint.y = y;
            this._redraw();
        }

        setControlPoint(point) {
            this._controlPoint = point;
            this._redraw();
        }

        setStrokeColor(color) {
            this.setStroke(null, null, color, null);
        }

        setStrokeWidth(width) {
            this.setStroke(width);
        }

        setDashed(isDashed, length, spacing) {
            if ($defined(isDashed) && isDashed && $defined(length) && $defined(spacing)) {
                this._native.setAttribute('stroke-dasharray', `${length},${spacing}`);
            } else {
                this._native.setAttribute('stroke-dasharray', '');
            }
        }

        _updateStyle() {
            let style = '';
            for (let key in this._style) {
                if (!this._style.hasOwnProperty(key)) {
                    continue;
                }
                style += `${key}: ${this._style[key]} `;
            }
            this._native.setAttribute('style', style);
        }

        _redraw() {
            let x,y, xp, yp;
            let fp = this._fromPoint;
            let cp = this._controlPoint;

            if ($defined(fp.x) && $defined(fp.y) && $defined(cp.x) && $defined(cp.y)) {
                if (cp.y == 0) {
                    cp.y = 1;
                }

                let y0 = cp.y;
                let x0 = cp.x;
                let x2 = x0 + y0;
                let y2 = y0 - x0;
                let x3 = x0 - y0;
                let y3 = y0 + x0;
                let m = y2 / x2;
                let mp = y3 / x3;
                let l = 6;
                let pow = Math.pow;

                x = (x2 == 0 ? 0 : Math.sqrt(pow(l, 2) / (1 + pow(m, 2))));
                x *= Math.sign(x2);

                y = (x2 == 0 ? l * Math.sign(y2) : m * x);
                xp = (x3 == 0 ? 0 : Math.sqrt(pow(l, 2) / (1 + pow(mp, 2))));
                xp *= Math.sign(x3);
                yp = (x3 == 0 ? l * Math.sign(y3) : mp * xp);

                let path = `M${fp.x},${fp.y} L${x+fp.x},${y+fp.y} M${fp.x},${fp.y} L${xp+fp.x},${yp+fp.y}`;
                this._native.setAttribute('d', path);
            }
        }
    }

    return ArrowPeer;
});
