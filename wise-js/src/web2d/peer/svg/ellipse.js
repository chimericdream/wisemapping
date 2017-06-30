/* global define, document */
'use strict';

define(['utils/is-defined', 'web2d/point', 'web2d/peer/svg/element'], ($defined, Point, ElementPeer) => {
    class EllipsePeer extends ElementPeer {
        constructor() {
            let svgElement = document.createElementNS(ElementPeer.svgNamespace, 'ellipse');
            super(svgElement);
            this.attachChangeEventListener('strokeStyle', this.updateStrokeStyle);
            this._position = {'x': 0, 'y': 0};
        }

        setSize(width, height) {
            super.setSize(width, height);
            if ($defined(width)) {
                this._native.setAttribute('rx', width / 2);
            }

            if ($defined(height)) {
                this._native.setAttribute('ry', height / 2);
            }

            let pos = this.getPosition();
            this.setPosition(pos.x, pos.y);
        }

        setPosition(cx, cy) {
            let size = this.getSize();
            cx = cx + size.width / 2;
            cy = cy + size.height / 2;
            if ($defined(cx)) {
                this._native.setAttribute('cx', cx);
            }

            if ($defined(cy)) {
                this._native.setAttribute('cy', cy);
            }
        }

        getPosition() {
            return this._position;
        }
    }

    return EllipsePeer;
});
