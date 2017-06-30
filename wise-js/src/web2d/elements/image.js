/* global define */
'use strict';

define(['element', 'toolkit'], (Element, Toolkit) => {
    class Image extends Element {
        static get TYPE() {
            return 'Image';
        }

        constructor(attributes) {
            let peer = Toolkit.createImage();
            super(peer, attributes);
        }

        setHref(href) {
            this._peer.setHref(href);
        }

        getHref() {
            return this._peer.getHref();
        }

        getSize() {
            return this._peer.getSize();
        }
    }

    return Image;
});
