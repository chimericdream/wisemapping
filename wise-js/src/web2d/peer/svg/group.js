/* global define, document */
'use strict';

define([
    'utils/is-defined',
    'web2d/point',
    'web2d/peer/svg/element',
    'web2d/peer/utils/event-utils'
], (
    $defined,
    Point,
    ElementPeer,
    EventUtils
) => {
    class GroupPeer extends ElementPeer {
        constructor() {
            super();
            this.init(document.createElementNS(ElementPeer.svgNamespace, 'g'));
            this._native.setAttribute('preserveAspectRatio', 'none');
            this._coordSize = {'width': 1, 'height': 1};
            this._native.setAttribute('focusable', 'true');
            this._position = {'x': 0, 'y': 0};
            this._coordOrigin = {'x': 0, 'y': 0};
        }

        setCoordSize(width, height) {
            let change = this._coordSize.width != width || this._coordSize.height != height;
            this._coordSize.width = width;
            this._coordSize.height = height;

            if (change) {
                this.updateTransform();
            }
            EventUtils.broadcastChangeEvent(this, 'strokeStyle');
        }

        getCoordSize() {
            return {'width': this._coordSize.width, 'height': this._coordSize.height};
        }

        updateTransform() {
            let sx = this._size.width / this._coordSize.width;
            let sy = this._size.height / this._coordSize.height;

            let cx = this._position.x - this._coordOrigin.x * sx;
            let cy = this._position.y - this._coordOrigin.y * sy;

            //FIXME: are we sure of this values?
            cx = isNaN(cx) ? 0 : cx;
            cy = isNaN(cy) ? 0 : cy;
            sx = isNaN(sx) ? 0 : sx;
            sy = isNaN(sy) ? 0 : sy;

            this._native.setAttribute('transform', `translate(${cx},${cy}) scale(${sx},${sy})`);
        }

        setOpacity(value) {
            this._native.setAttribute('opacity', value);
        }

        setCoordOrigin(x, y) {
            let change = x != this._coordOrigin.x || y != this._coordOrigin.y;
            if ($defined(x)) {
                this._coordOrigin.x = x;
            }

            if ($defined(y)) {
                this._coordOrigin.y = y;
            }

            if (change) {
                this.updateTransform();
            }
        }

        setSize(width, height) {
            let change = width != this._size.width || height != this._size.height;
            super.setSize(width, height);
            if (change) {
                this.updateTransform();
            }
        }

        setPosition(x, y) {
            let change = x != this._position.x || y != this._position.y;
            if ($defined(x)) {
                this._position.x = parseInt(x);
            }

            if ($defined(y)) {
                this._position.y = parseInt(y);
            }
            if (change) {
                this.updateTransform();
            }
        }

        getPosition() {
            return {'x': this._position.x, 'y': this._position.y};
        }

        append(child) {
            super.append(child);
            EventUtils.broadcastChangeEvent(child, 'onChangeCoordSize');
        }

        getCoordOrigin() {
            return {'x': this._coordOrigin.x, 'y': this._coordOrigin.y};
        }
    }

    return GroupPeer;
});
