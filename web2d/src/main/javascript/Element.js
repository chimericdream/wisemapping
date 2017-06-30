/* global define */
'use strict';

define(['assert', 'is-defined'], ($assert, $defined) => {
    const _SIGNATURE_MULTIPLE_ARGUMENTS = -1;

    const _supportedEvents = ['click', 'dblclick', 'mousemove', 'mouseout', 'mouseover', 'mousedown', 'mouseup'];

    const _propertyNameToSignature = {
        // Format: [attribute name, argument position on setter, attribute name on getter]
        size: ['size', -1],
        width: ['size', 0, 'width'],
        height: ['size', 1, 'height'],

        position: ['position', -1],
        x: ['position', 0, 'x'],
        y: ['position', 1, 'y'],

        stroke: ['stroke', -1],
        strokeWidth: ['stroke', 0, 'width'],
        strokeStyle: ['stroke', 1, 'style'],
        strokeColor: ['stroke', 2, 'color'],
        strokeOpacity: ['stroke', 3, 'opacity'],

        fill: ['fill', -1],
        fillColor: ['fill', 0, 'color'],
        fillOpacity: ['fill', 1, 'opacity'],

        coordSize: ['coordSize', -1],
        coordSizeWidth: ['coordSize', 0, 'width'],
        coordSizeHeight: ['coordSize', 1, 'height'],

        coordOrigin: ['coordOrigin', -1],
        coordOriginX: ['coordOrigin', 0, 'x'],
        coordOriginY: ['coordOrigin', 1, 'y'],

        visibility: ['visibility', 0],
        opacity: ['opacity', 0]
    };

    class Element {
        constructor(peer, attributes) {
            $assert((peer !== null), 'Element peer can not be null');

            this._peer = peer;

            this._SIGNATURE_MULTIPLE_ARGUMENTS = _SIGNATURE_MULTIPLE_ARGUMENTS;
            this._supportedEvents = _supportedEvents;
            this._propertyNameToSignature = _propertyNameToSignature;

            if ($defined(attributes)) {
                this._initialize(attributes);
            }
        }

        _initialize(attributes) {
            let batchExecute = {};

            for (let key in attributes) {
                if (!attributes.hasOwnProperty(key)) {
                    continue;
                }

                let funcName = this._attributeNameToFuncName(key, 'set');
                let funcArgs = batchExecute[funcName];

                if (!$defined(funcArgs)) {
                    funcArgs = [];
                }

                let signature = this._propertyNameToSignature[key];
                let argPositions = signature[1];
                if (argPositions != this._SIGNATURE_MULTIPLE_ARGUMENTS) {
                    funcArgs[argPositions] = attributes[key];
                } else {
                    funcArgs = attributes[key].split(' ');
                }
                batchExecute[funcName] = funcArgs;
            }

            for (let key in batchExecute) {
                if (!batchExecute.hasOwnProperty(key)) {
                    continue;
                }

                let func = this[key];
                if (!$defined(func)) {
                    throw new Error(`Could not find function: ${key}`);
                }
                func.apply(this, batchExecute[key]);
            }
        }

        _initializeAttributes(defaults, params) {
            let attributes = defaults;
            for (let key in params) {
                if (!params.hasOwnProperty(key)) {
                    continue;
                }
                attributes[key] = params[key];
            }
            return attributes;
        }

        _attributeNameToFuncName(key, prefix) {
            let signature = this._propertyNameToSignature[key];
            if (!$defined(signature)) {
                throw `Unsupported attribute: ${key}`;
            }

            let firstLetter = signature[0].charAt(0);
            return  prefix + firstLetter.toUpperCase() + signature[0].substring(1);
        }

        setSize(width, height) {
            this._peer.setSize(width, height);
        }

        setPosition(cx, cy) {
            this._peer.setPosition(cx, cy);
        }

        /**
         * Allows the registration of event listeners on the event target.
         * type
         *     A string representing the event type to listen for.
         * listener
         *     The object that receives a notification when an event of the specified type occurs. This must be an object implementing the EventListener interface, or simply a function in JavaScript.
         *
         * The following events types are supported:
         *
         */
        addEvent(type, listener) {
            this._peer.addEvent(type, listener);
        }

        trigger(type, event) {
            this._peer.trigger(type, event);
        }

        cloneEvents(from) {
            this._peer.cloneEvents(from);
        }

        /**
         *
         * Allows the removal of event listeners from the event target.
         *
         * Parameters:
         * type
         *    A string representing the event type being registered.
         * listener
         *     The listener parameter takes an interface implemented by the user which contains the methods to be called when the event occurs.
         *     This interace will be invoked passing an event as argument and the 'this' referece in the function will be the element.
         */
        removeEvent(type, listener) {
            this._peer.removeEvent(type, listener);
        }

        /**
         * Todo: Doc
         */
        getFill() {
            return this._peer.getFill();
        }

        /**
         * Used to define the fill element color and element opacity.
         * color: Fill color
         * opacity: Opacity of the fill. It must be less than 1.
         */
        setFill(color, opacity) {
            this._peer.setFill(color, opacity);
        }

        getPosition() {
            return this._peer.getPosition();
        }

        getNativePosition() {
            return this._peer.getNativePosition();
        }

        /*
         *  Defines the element stroke properties.
         *  width: stroke width
         *  style: 'solid|dot|dash|dashdot|longdash'.
         *  color: stroke color
         *  opacity: stroke visibility
         */
        setStroke(width, style, color, opacity) {
            if (style != null && style != undefined && style != 'dash' && style != 'dot' && style != 'solid' && style != 'longdash' && style != 'dashdot') {
                throw new Error(`Unsupported stroke style: '${style}'`);
            }
            this._peer.setStroke(width, style, color, opacity);
        }

        /**
         * All element properties can be setted using either a method invocation or attribute invocation.
         *  key: size, width, height, position, x, y, stroke, strokeWidth, strokeStyle, strokeColor, strokeOpacity,
         *       fill, fillColor, fillOpacity, coordSize, coordSizeWidth, coordSizeHeight, coordOrigin, coordOriginX, coordOrigiY
         */
        setAttribute(key, value) {
            var funcName = this._attributeNameToFuncName(key, 'set');
            var signature = this._propertyNameToSignature[key];
            if (signature == null) {
                throw `Could not find the signature for: ${key}`;
            }

            // Parse arguments ..
            var argPositions = signature[1];
            var args = [];
            if (argPositions !== this._SIGNATURE_MULTIPLE_ARGUMENTS) {
                args[argPositions] = value;
            }
            else if (typeof value == 'array') {
                args = value;
            } else {
                var strValue = String(value);
                args = strValue.split(' ');
            }

            // Look up method ...
            var setter = this[funcName];
            if (setter == null) {
                throw `Could not find the function name: ${funcName}`;
            }
            setter.apply(this, args);
        }

        getAttribute(key) {
            let signature = this._propertyNameToSignature[key];
            if (signature == null) {
                throw `Could not find the signature for: ${key}`;
            }

            let funcName = this._attributeNameToFuncName(key, 'get');
            let getter = this[funcName];
            if (getter == null) {
                throw `Could not find the function name: ${funcName}`;
            }

            let getterResult = getter.apply(this, []);
            let attributeName = signature[2];
            if (!$defined(attributeName)) {
                throw `Could not find attribute mapping for: ${key}`;
            }

            let result = getterResult[attributeName];
            if (!$defined(result)) {
                throw `Could not find attribute with name: ${attributeName}`;
            }

            return result;
        }

        /**
         * Defines the element opacity.
         * Parameters:
         *   opacity: A value between 0 and 1.
         */
        setOpacity(opacity) {
            this._peer.setStroke(null, null, null, opacity);
            this._peer.setFill(null, opacity);
        }

        setVisibility(isVisible) {
            this._peer.setVisibility(isVisible);
        }

        isVisible() {
            return this._peer.isVisible();
        }

        /**
         * Move the element to the front
         */
        moveToFront() {
            this._peer.moveToFront();
        }

        /**
         * Move the element to the back
         */
        moveToBack() {
            this._peer.moveToBack();
        }

        getStroke() {
            return this._peer.getStroke();
        }

        setCursor(type) {
            this._peer.setCursor(type);
        }

        getParent() {
            return this._peer.getParent();
        }
    }

    return Element;
});
