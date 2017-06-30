/* global define, document */
'use strict';

define(['utils/is-defined', 'web2d/point', 'web2d/peer/svg/element'], ($defined, Point, ElementPeer) => {
    class CurvedLinePeer extends ElementPeer {
        constructor() {
            let svgElement = document.createElementNS(ElementPeer.svgNamespace, 'path');
            super(svgElement);
            this._style = {'fill': '#495879'};
            this._updateStyle();
            this._customControlPoint_1 = false;
            this._customControlPoint_2 = false;
            this._control1 = new Point();
            this._control2 = new Point();
            this._lineStyle = true;
        }

        setSrcControlPoint(control) {
            this._customControlPoint_1 = true;
            let change = this._control1.x != control.x || this._control1.y != control.y;
            if ($defined(control.x)) {
                this._control1 = control;
                this._control1.x = parseInt(this._control1.x);
                this._control1.y = parseInt(this._control1.y)
            }
            if (change) {
                this._updatePath();
            }
        }

        setDestControlPoint(control) {
            this._customControlPoint_2 = true;
            let change = this._control2.x != control.x || this._control2.y != control.y;
            if ($defined(control.x)) {
                this._control2 = control;
                this._control2.x = parseInt(this._control2.x);
                this._control2.y = parseInt(this._control2.y)
            }
            if (change) {
                this._updatePath();
            }
        }

        isSrcControlPointCustom() {
            return this._customControlPoint_1;
        }

        isDestControlPointCustom() {
            return this._customControlPoint_2;
        }

        setIsSrcControlPointCustom(isCustom) {
            this._customControlPoint_1 = isCustom;
        }

        setIsDestControlPointCustom(isCustom) {
            this._customControlPoint_2 = isCustom;
        }

        getControlPoints() {
            return [this._control1, this._control2];
        }

        setFrom(x1, y1) {
            let change = this._x1 != parseInt(x1) || this._y1 != parseInt(y1);
            this._x1 = parseInt(x1);
            this._y1 = parseInt(y1);
            if (change) {
                this._updatePath();
            }
        }

        setTo(x2, y2) {
            let change = this._x2 != parseInt(x2) || this._y2 != parseInt(y2);
            this._x2 = parseInt(x2);
            this._y2 = parseInt(y2);
            if (change) {
                this._updatePath();
            }
        }

        getFrom() {
            return new Point(this._x1, this._y1);
        }

        getTo() {
            return new Point(this._x2, this._y2);
        }

        setStrokeWidth(width) {
            this._style['stroke-width'] = width;
            this._updateStyle();
        }

        setColor(color) {
            this._style['stroke'] = color;
            this._style['fill'] = color;
            this._updateStyle();
        }

        updateLine(avoidControlPointFix) {
            this._updatePath(avoidControlPointFix);
        }

        setLineStyle(style) {
            this._lineStyle = style;
            if (this._lineStyle) {
                this._style['fill'] = this._fill;
            } else {
                this._fill = this._style['fill'];
                this._style['fill'] = 'none';
            }
            this._updateStyle();
            this.updateLine();
        }

        getLineStyle() {
            return this._lineStyle;
        }

        setShowEndArrow(visible) {
            this._showEndArrow = visible;
            this.updateLine();
        }

        isShowEndArrow() {
            return this._showEndArrow;
        }

        setShowStartArrow(visible) {
            this._showStartArrow = visible;
            this.updateLine();
        }

        isShowStartArrow() {
            return this._showStartArrow;
        }

        _updatePath(avoidControlPointFix) {
            if ($defined(this._x1) && $defined(this._y1) && $defined(this._x2) && $defined(this._y2)) {
                this._calculateAutoControlPoints(avoidControlPointFix);

                let x1 = this._x1,
                    y1 = this._y1,
                    x2 = this._x2,
                    y2 = this._y2,
                    c1 = this._control1,
                    c2 = this._control2;

                let path = `M${x1},${y1} C${c1.x+x1},${c1.y+y1} ${c2.x+x2},${c2.y + y2} ${x2},${y2}`
                         + (this._lineStyle ? ` ${c2.x+x2},${c2.y+y2+3} ${c1.x+x1},${c1.y+y1+5} ${x1},${y1+7} Z` : '');
                this._native.setAttribute('d', path);
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

        _calculateAutoControlPoints(avoidControlPointFix) {
            //Both points available, calculate real points
            let defaultpoints = mindplot.util.Shape.calculateDefaultControlPoints(new Point(this._x1, this._y1), new Point(this._x2, this._y2));
            if (!this._customControlPoint_1 && !($defined(avoidControlPointFix) && avoidControlPointFix == 0)) {
                this._control1.x = defaultpoints[0].x;
                this._control1.y = defaultpoints[0].y;
            }
            if (!this._customControlPoint_2 && !($defined(avoidControlPointFix) && avoidControlPointFix == 1)) {
                this._control2.x = defaultpoints[1].x;
                this._control2.y = defaultpoints[1].y;
            }
        }

        setDashed(length, spacing) {
            if ($defined(length) && $defined(spacing)) {
                this._native.setAttribute('stroke-dasharray', `${length},${spacing}`);
            } else {
                this._native.setAttribute('stroke-dasharray', '');
            }
        }
    }

    return CurvedLinePeer;
});
