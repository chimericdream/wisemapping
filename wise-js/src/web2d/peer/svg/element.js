/* global define */
'use strict';

define([
    'jquery',
    'utils/assert',
    'utils/is-defined',
    'web2d/peer/utils/event-utils',
    'web2d/peer/utils/transform-utils'
], (
    $,
    $assert,
    $defined,
    EventUtils,
    TransformUtils
) => {
    class ElementPeer {
        static get svgNamespace() {
            return 'http://www.w3.org/2000/svg';
        }

        static get linkNamespace() {
            return 'http://www.w3.org/1999/xlink';
        }

        static get __stokeStyleToStrokeDasharray() {
            return {
                'solid': [],
                'dot': [1, 3],
                'dash': [4, 3],
                'longdash': [10, 2],
                'dashdot': [5, 3, 1, 3]
            };
        }

        constructor() {}

        init(svgElement) {
            this._native = svgElement;
            this._size = {'width': 1, 'height': 1};
            this._changeListeners = {};
        }

        setChildren(children) {
            this._children = children;
        }

        getChildren() {
            let result = this._children;
            if (!$defined(result)) {
                result = [];
                this._children = result;
            }
            return result;
        }

        getParent() {
            return this._parent;
        }

        setParent(parent) {
            this._parent = parent;
        }

        append(elementPeer) {
            // Store parent and child relationship.
            elementPeer.setParent(this);
            let children = this.getChildren();
            children.include(elementPeer);

            // Append element as a child.
            this._native.appendChild(elementPeer._native);

            // Broadcast events ...
            EventUtils.broadcastChangeEvent(this, 'strokeStyle');
        }

        removeChild(elementPeer) {
            // Store parent and child relationship.
            elementPeer.setParent(null);
            let children = this.getChildren();

            // Remove from children array ...
            let oldLength = children.length;

            children.erase(elementPeer);
            $assert(children.length < oldLength, `element could not be removed: ${elementPeer}`);

            // Append element as a child.
            this._native.removeChild(elementPeer._native);
        }

        /**
         * http://www.w3.org/TR/DOM-Level-3-Events/events.html
         * http://developer.mozilla.org/en/docs/addEvent
         */
        addEvent(type, listener) {
            $(this._native).bind(type, listener);
        }

        trigger(type, event) {
            $(this._native).trigger(type, event);
        }

        cloneEvents(from) {
            this._native.cloneEvents(from);
        }

        removeEvent(type, listener) {
            $(this._native).unbind(type, listener);
        }

        setSize(width, height) {
            if ($defined(width) && this._size.width != parseInt(width)) {
                this._size.width = parseInt(width);
                this._native.setAttribute('width', parseInt(width));
            }

            if ($defined(height) && this._size.height != parseInt(height)) {
                this._size.height = parseInt(height);
                this._native.setAttribute('height', parseInt(height));
            }

            EventUtils.broadcastChangeEvent(this, 'strokeStyle');
        }

        getSize() {
            return {width:this._size.width, height:this._size.height};
        }

        setFill(color, opacity) {
            if ($defined(color)) {
                this._native.setAttribute('fill', color);
            }
            if ($defined(opacity)) {
                this._native.setAttribute('fill-opacity', opacity);
            }
        }

        getFill() {
            let color = this._native.getAttribute('fill');
            let opacity = this._native.getAttribute('fill-opacity');
            return {'color': color, 'opacity': Number(opacity)};
        }

        getStroke() {
            let vmlStroke = this._native;
            let color = vmlStroke.getAttribute('stroke');
            let dashstyle = this._stokeStyle;
            let opacity = vmlStroke.getAttribute('stroke-opacity');
            let width = vmlStroke.getAttribute('stroke-width');
            return {'color': color, 'style': dashstyle, 'opacity': opacity, 'width': width};
        }

        setStroke(width, style, color, opacity) {
            if ($defined(width)) {
                this._native.setAttribute('stroke-width', `${width}px`);
            }
            if ($defined(color)) {
                this._native.setAttribute('stroke', color);
            }
            if ($defined(style)) {
                // Scale the dash array in order to be equal to VML. In VML, stroke style doesn't scale.
                let dashArrayPoints = this.__stokeStyleToStrokDasharray[style];
                let scale = 1 / TransformUtils.workoutScale(this).width;

                let strokeWidth = this._native.getAttribute('stroke-width');
                strokeWidth = parseFloat(strokeWidth);

                let scaledPoints = [];
                for (let i = 0; i < dashArrayPoints.length; i++) {
                    // VML scale the stroke based on the stroke width.
                    scaledPoints[i] = dashArrayPoints[i] * strokeWidth;

                    // Scale the points based on the scale.
                    scaledPoints[i] = (scaledPoints[i] * scale) + 'px';
                }

                this._stokeStyle = style;
            }

            if ($defined(opacity)) {
                this._native.setAttribute('stroke-opacity', opacity);
            }
        }

        /*
         * style='visibility: visible'
         */
        setVisibility(isVisible) {
            this._native.setAttribute('visibility', (isVisible) ? 'visible' : 'hidden');
        }

        isVisible() {
            let visibility = this._native.getAttribute('visibility');
            return !(visibility == 'hidden');
        }

        updateStrokeStyle() {
            let strokeStyle = this._stokeStyle;
            if (this.getParent()) {
                if (strokeStyle && strokeStyle != 'solid') {
                    this.setStroke(null, strokeStyle);
                }
            }
        }

        attachChangeEventListener(type, listener) {
            let listeners = this.getChangeEventListeners(type);
            if (!$defined(listener)) {
                throw 'Listener cannot be null';
            }
            listeners.push(listener);
        }

        getChangeEventListeners(type) {
            let listeners = this._changeListeners[type];
            if (!$defined(listeners)) {
                listeners = [];
                this._changeListeners[type] = listeners;
            }
            return listeners;
        }

        /**
         * Move element to the front
         */
        moveToFront() {
            this._native.parentNode.appendChild(this._native);
        }

        /**
         * Move element to the back
         */
        moveToBack() {
            this._native.parentNode.insertBefore(this._native, this._native.parentNode.firstChild);
        }

        setCursor(type) {
            this._native.style.cursor = type;
        }
    }

    return ElementPeer;
});
