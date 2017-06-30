/* global define */
'use strict';

define(['element', 'toolkit'], (Element, Toolkit) => {
    class Line extends Element {
        static get TYPE() {
            return 'Line';
        }

        static get defaults() {
            return {
                'strokeColor': '#495879',
                'strokeWidth': 1,
                'strokeOpacity': 1
            };
        }

        constructor(params) {
            super(Toolkit.createLine(), this._initializeAttributes(this.defaults, params));
        }

        setFrom(x, y) {
            this._peer.setFrom(x, y);
        }

        setTo(x, y) {
            this._peer.setTo(x, y);
        }

        getFrom() {
            return this._peer.getFrom();
        }

        getTo() {
            return this._peer.getTo();
        }

        /**
         * Defines the start and the end line arrow style.
         * Can have values 'none | block | classic | diamond | oval | open | chevron | doublechevron'
         **/
        setArrowStyle(startStyle, endStyle) {
            this._peer.setArrowStyle(startStyle, endStyle);
        }

        setPosition(cx, cy) {
            throw 'Unsupported operation';
        }

        setSize(width, height) {
            throw 'Unsupported operation';
        }

        setFill(color, opacity) {
            throw 'Unsupported operation';
        }
    }

    return Line;
});
