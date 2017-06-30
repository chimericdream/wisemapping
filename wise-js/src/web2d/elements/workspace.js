/* global define, window */
'use strict';

define(['jQuery', 'assert', 'is-defined', 'element', 'toolkit'], ($, $assert, $defined, Element, Toolkit) => {
    class Workspace extends Element {
        static get TYPE() {
            return 'Workspace';
        }

        get defaults() {
            return {
                'width': '200px',
                'height': '200px',
                'stroke': '1px solid #edf1be',
                'fillColor': 'white',
                'coordOrigin': '0 0',
                'coordSize': '200 200'
            };
        }

        constructor(params) {
            this._htmlContainer = this._createDivContainer();
            super(Toolkit.createWorkspace(this._htmlContainer), this._initializeAttributes(this.defaults, params));
            this._htmlContainer.append(this._peer._native);
        }

        /**
         * Appends an element as a child to the object.
         */
        append(element) {
            $assert($defined(element), 'Child element can not be null');
            $assert((element.TYPE !== null), `It seems not to be an element -> ${element}`);
            $assert((element.TYPE !== 'Workspace'), 'A workspace can not have a workspace as a child');

            this._peer.append(element._peer);
        }

        addItAsChildTo(element) {
            $assert($defined(element), 'Workspace div container can not be null');
            element.append(this._htmlContainer);
        }

        /**
         * Create a new div element that will be responsible for containing the workspace elements.
         */
        _createDivContainer() {
            let container = window.document.createElement('div');
            container.id = 'workspaceContainer';
            container.style.position = 'relative';
            container.style.top = '0px';
            container.style.left = '0px';
            container.style.height = '688px';
            container.style.border = '1px solid red';

            return $(container);
        }

        /**
         *  Set the workspace area size. It can be defined using different units:
         * in (inches; 1in=2.54cm)
         * cm (centimeters; 1cm=10mm)
         * mm (millimeters)
         * pt (points; 1pt=1/72in)
         * pc (picas; 1pc=12pt)
         */
        setSize(width, height) {
            // HTML container must have the size of the group element.
            if ($defined(width)) {
                this._htmlContainer.css('width', width);
            }
            if ($defined(height)) {
                this._htmlContainer.css('height', height);
            }

            this._peer.setSize(width, height);
        }

        /**
         * The workspace element is a containing blocks for this content - they define a CSS2 "block level box".
         * Inside the containing block a local coordinate system is defined for any sub-elements using the coordsize and coordorigin attributes.
         * All CSS2 positioning information is expressed in terms of this local coordinate space.
         * Consequently CSS2 position attributes (left, top, width, height and so on) have no unit specifier -
         * they are simple numbers, not CSS length quantities.
         */
        setCoordSize(width, height) {
            this._peer.setCoordSize(width, height);
        }

        /**
         * @Todo: Complete Doc
         */
        setCoordOrigin(x, y) {
            this._peer.setCoordOrigin(x, y);
        }

        /**
         * @Todo: Complete Doc
         */
        getCoordOrigin() {
            return this._peer.getCoordOrigin();
        }

        // Private method declaration area
        /**
         * All the SVG elements will be children of this HTML element.
         */
        _getHtmlContainer() {
            return this._htmlContainer;
        }

        setFill(color, opacity) {
            $assert(!(opacity || opacity === 0), 'Unsupported operation. Opacity not supported.');
            this._htmlContainer.css('background-color', color);
        }

        getFill() {
            let color = this._htmlContainer.css('background-color');
            return {'color': color};
        }

        getSize() {
            let width = this._htmlContainer.css('width');
            let height = this._htmlContainer.css('height');
            return {'width': width, 'height': height};
        }

        setStroke(width, style, color, opacity) {
            $assert(!(opacity || opacity === 0), 'Unsupported operation. Opacity not supported.');
            $assert((style != 'solid'), `Not supported style stroke style: ${style}`);
            this._htmlContainer.css('border', `${width} ${style} ${color}`);
        }

        getCoordSize() {
            return this._peer.getCoordSize();
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

        dumpNativeChart() {
            return this._htmlContainer.innerHTML;
        }
    }

    return Workspace;
});
