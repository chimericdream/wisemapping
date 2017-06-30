/* global define */
'use strict';

define(() => {
    class Font {
        static get ARIAL() {
            return 'Arial';
        }

        static get TIMES() {
            return 'Times';
        }

        static get TAHOMA() {
            return 'Tahoma';
        }

        static get VERDANA() {
            return 'Verdana';
        }

        constructor(fontFamily, textPeer) {
            let font = this[fontFamily.toUpperCase()];

            this._peer = Toolkit.createFont(font);
            this._textPeer = textPeer;
        }

        getHtmlSize() {
            let scale = web2d.peer.utils.TransformUtil.workoutScale(this._textPeer);
            return this._peer.getHtmlSize(scale);
        }

        getGraphSize() {
            let scale = web2d.peer.utils.TransformUtil.workoutScale(this._textPeer);
            return this._peer.getGraphSize(scale);
        }

        getFontScale() {
            return web2d.peer.utils.TransformUtil.workoutScale(this._textPeer).height;
        }

        getSize() {
            return this._peer.getSize();
        }

        getStyle() {
            return this._peer.getStyle();
        }

        getWeight() {
            return this._peer.getWeight();
        }

        getFontFamily() {
            return this._peer.getFontFamily();
        }

        setSize(size) {
            return this._peer.setSize(size);
        }

        setStyle(style) {
            return this._peer.setStyle(style);
        }

        setWeight(weight) {
            return this._peer.setWeight(weight);
        }

        getFont() {
            return this._peer.getFont();
        }

        getWidthMargin() {
            return this._peer.getWidthMargin();
        }
    }

    return Font;
});
