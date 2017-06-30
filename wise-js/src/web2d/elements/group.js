/* global define */
'use strict';

define(['assert', 'is-defined', 'element', 'toolkit'], ($assert, $defined, Element, Toolkit) => {
    class Group extends Element {
        static get TYPE() {
            return 'Group';
        }

        static get defaults() {
            return {
                'width': 50,
                'height': 50,
                'x': 50,
                'y': 50,
                'coordOrigin': '0 0',
                'coordSize': '50 50'
            };
        }

        constructor(params) {
            super(Toolkit.createGroup(), this._initializeAttributes(this.defaults, params));
        }

        /**
         * Remove an element as a child to the object.
         */
        removeChild(element) {
            $assert($defined(element), 'Child element can not be null');
            $assert((element !== this), "It's not possible to add the group as a child of itself");
            $assert((element.TYPE !== null), `It seems not to be an element -> ${element}`);

            this._peer.removeChild(element._peer);
        }

        /**
         * Appends an element as a child to the object.
         */
        append(element) {
            $assert($defined(element), 'Child element can not be null');
            $assert((element !== this), "It's not possible to add the group as a child of itself");
            $assert((element.TYPE !== null), `It seems not to be an element -> ${element}`);
            $assert((element.TYPE !== 'Workspace'), 'A group can not have a workspace as a child');

            this._peer.append(element._peer);
        }

        /**
         * The group element is a containing blocks for this content - they define a CSS2 "block level box".
         * Inside the containing block a local coordinate system is defined for any sub-elements using the coordsize and coordorigin attributes.
         * All CSS2 positioning information is expressed in terms of this local coordinate space.
         * Consequently CSS2 position attributes (left, top, width, height and so on) have no unit specifier -
         * they are simple numbers, not CSS length quantities.
         */
        setCoordSize(width, height) {
            this._peer.setCoordSize(width, height);
        }

        setCoordOrigin(x, y) {
            this._peer.setCoordOrigin(x, y);
        }

        getCoordOrigin() {
            return this._peer.getCoordOrigin();
        }

        getSize() {
            return this._peer.getSize();
        }

        setFill(color, opacity) {
            throw 'Unsupported operation. Fill can not be set to a group';
        }

        setStroke(width, style, color, opacity) {
            throw 'Unsupported operation. Stroke can not be set to a group';
        }

        getCoordSize() {
            return this._peer.getCoordSize();
        }

        appendDomChild(DomElement) {
            $assert($defined(DomElement), 'Child element can not be null');
            $assert((DomElement !== this), "It's not possible to add the group as a child of itself");

            this._peer._native.append(DomElement);
        }

        setOpacity(value) {
            this._peer.setOpacity(value);
        }
    }

    return Group;
});
