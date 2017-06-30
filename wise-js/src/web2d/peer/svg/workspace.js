/* global define, document */
'use strict';

define(['utils/is-defined', 'web2d/peer/utils/event-utils', 'web2d/peer/svg/element'], ($defined, EventUtils, ElementPeer) => {
    class WorkspacePeer extends ElementPeer {
        constructor(element) {
            this._element = element;
            let svgElement = document.createElementNS(ElementPeer.svgNamespace, 'svg');
            super(svgElement);
            this._native.setAttribute('focusable', 'true');
            this._native.setAttribute('id', 'workspace');
            this._native.setAttribute('preserveAspectRatio', 'none');
        }

        setCoordSize(width, height) {
            let viewBox = this._native.getAttribute('viewBox');
            let coords = [0, 0, 0, 0];
            if (viewBox != null) {
                coords = viewBox.split(/ /);
            }
            if ($defined(width)) {
                coords[2] = width;
            }

            if ($defined(height)) {
                coords[3] = height;
            }

            this._native.setAttribute('viewBox', coords.join(' '));
            this._native.setAttribute('preserveAspectRatio', 'none');
            EventUtils.broadcastChangeEvent(this, 'strokeStyle');
        }

        getCoordSize() {
            let viewBox = this._native.getAttribute('viewBox');
            let coords = [1, 1, 1, 1];
            if (viewBox != null) {
                coords = viewBox.split(/ /);
            }
            return {'width': coords[2], 'height': coords[3]};
        }

        setCoordOrigin(x, y) {
            let viewBox = this._native.getAttribute('viewBox');

            // ViewBox min-x ,min-y by default initializated with 0 and 0.
            let coords = [0, 0, 0, 0];
            if (viewBox != null) {
                coords = viewBox.split(/ /);
            }

            if ($defined(x)) {
                coords[0] = x;
            }

            if ($defined(y)) {
                coords[1] = y;
            }

            this._native.setAttribute('viewBox', coords.join(' '));
        }

        append(child) {
            super.append(child);
            EventUtils.broadcastChangeEvent(child, 'onChangeCoordSize');
        }

        getCoordOrigin(child) {
            let viewBox = this._native.getAttribute('viewBox');
            let coords = [1, 1, 1, 1];
            if (viewBox != null) {
                coords = viewBox.split(/ /);
            }
            let x = parseFloat(coords[0]);
            let y = parseFloat(coords[1]);
            return {'x': x, 'y': y};
        }

        getPosition() {
            return {'x': 0, 'y': 0};
        }
    }

    return WorkspacePeer;
});
