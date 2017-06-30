/* global define */
'use strict';

define(['assert', 'element', 'toolkit'], ($assert, Element, Toolkit) => {
    class CurvedLine extends Element {
        static get SIMPLE_LINE() {
            return false;
        }

        static get NICE_LINE() {
            return true;
        }

        static get TYPE() {
            return 'CurvedLine';
        }

        get defaults() {
            return {
                'strokeColor': 'blue',
                'strokeWidth': 1,
                'strokeStyle': 'solid',
                'strokeOpacity': 1
            };
        }

        constructor(params) {
            super(Toolkit.createCurvedLine(), this._initializeAttributes(this.defaults, params));
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
