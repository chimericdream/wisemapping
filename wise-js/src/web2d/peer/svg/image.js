/* global define, document */
'use strict';

define(['utils/is-defined', 'web2d/peer/svg/element'], ($defined, ElementPeer) => {
    class ImagePeer extends ElementPeer {
        constructor() {
            let svgElement = document.createElementNS(ElementPeer.svgNamespace, 'image');
            super(svgElement);
            this._position = {'x': 0, 'y': 0};
            this._href = '';
            this._native.setAttribute('preserveAspectRatio', 'none');
        }

        setPosition(x, y) {
            this._position = {'x': x, 'y': y};
            this._native.setAttribute('y', y);
            this._native.setAttribute('x', x);
        }

        getPosition() {
            return this._position;
        }

        setHref(url) {
            this._native.setAttributeNS(ElementPeer.linkNamespace, 'href', url);
            this._href = url;
        }

        getHref() {
            return this._href;
        }
    }

    return ImagePeer;
});
