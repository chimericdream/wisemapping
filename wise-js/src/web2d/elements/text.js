/* global define */
'use strict';

define(['util/assert', 'element', 'toolkit'], ($assert, Element, Toolkit) => {
    class Text extends Element {
        static get TYPE() {
            return 'Text';
        }

        static get defaults() {
            return {};
        }

        constructor(params) {
            super(Toolkit.createText(), this._initializeAttributes(this.defaults, params));
        }

        setText(text) {
            this._peer.setText(text);
        }

        setTextAlignment(align) {
            $assert(align, 'align can not be null');
            this._peer.setTextAlignment(align);
        }

        setTextSize(width, height) {
            this._peer.setContentSize(width, height);
        }

        getText() {
            return this._peer.getText();
        }

        setFont(font, size, style, weight) {
            this._peer.setFont(font, size, style, weight);
        }

        setColor(color) {
            this._peer.setColor(color);
        }

        getColor() {
            return this._peer.getColor();
        }

        setStyle(style) {
            this._peer.setStyle(style);
        }

        setWeight(weight) {
            this._peer.setWeight(weight);
        }

        setFontFamily(family) {
            this._peer.setFontFamily(family);
        }

        getFont() {
            return this._peer.getFont();
        }

        setSize(size) {
            this._peer.setSize(size);
        }

        getHtmlFontSize() {
            return this._peer.getHtmlFontSize();
        }

        getWidth() {
            return this._peer.getWidth();
        }

        getHeight() {
            return parseInt(this._peer.getHeight());
        }

        getFontHeight() {
            let lines = this._peer.getText().split('\n').length;
            return Math.round(this.getHeight() / lines);
        }
    }

    return Text;
});
