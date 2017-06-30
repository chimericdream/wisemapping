/* global define */
'use strict';

define(['assert', 'element', 'toolkit'], ($assert, Element, Toolkit) => {
    class CurvedLine extends Element {
        constructor(attributes) {
            this.SIMPLE_LINE = false;
            this.NICE_LINE = true;

            let peer = Toolkit.createCurvedLine();
            let defaultAttributes = {'strokeColor': 'blue', 'strokeWidth': 1, 'strokeStyle': 'solid', 'strokeOpacity': 1};
            for (let key in attributes) {
                if (!attributes.hasOwnProperty(key)) {
                    continue;
                }
                defaultAttributes[key] = attributes[key];
            }
            super(peer, defaultAttributes);
        }

        getType() {
            return 'CurvedLine';
        }

        setFrom(x, y) {
            $assert(!isNaN(x), "x must be defined");
            $assert(!isNaN(y), "y must be defined");

            this._peer.setFrom(x, y);
        }

        setTo(x, y) {
            $assert(!isNaN(x), "x must be defined");
            $assert(!isNaN(y), "y must be defined");

            this._peer.setTo(x, y);
        }

        getFrom() {
            return this._peer.getFrom();
        }

        getTo() {
            return this._peer.getTo();
        }

        setShowEndArrow(visible) {
            this._peer.setShowEndArrow(visible);
        }

        isShowEndArrow() {
            return this._peer.isShowEndArrow();
        }

        setShowStartArrow(visible) {
            this._peer.setShowStartArrow(visible);
        }

        isShowStartArrow() {
            return this._peer.isShowStartArrow();
        }

        setSrcControlPoint(control) {
            this._peer.setSrcControlPoint(control);
        }

        setDestControlPoint(control) {
            this._peer.setDestControlPoint(control);
        }

        getControlPoints() {
            return this._peer.getControlPoints();
        }

        isSrcControlPointCustom() {
            return this._peer.isSrcControlPointCustom();
        }

        isDestControlPointCustom() {
            return this._peer.isDestControlPointCustom();
        }

        setIsSrcControlPointCustom(isCustom) {
            this._peer.setIsSrcControlPointCustom(isCustom);
        }

        setIsDestControlPointCustom(isCustom) {
            this._peer.setIsDestControlPointCustom(isCustom);
        }

        updateLine(avoidControlPointFix) {
            return this._peer.updateLine(avoidControlPointFix);
        }

        setStyle(style) {
            this._peer.setLineStyle(style);
        }

        getStyle() {
            return this._peer.getLineStyle();
        }

        setDashed(length, spacing) {
            this._peer.setDashed(length, spacing);
        }
    }

    return CurvedLine;
});
