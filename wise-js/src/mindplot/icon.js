/* global define */
'use strict';

define(['utils/assert', 'web2d/elements/image'], ($assert, ImageElement) => {
    class Icon {
        static get BASE_SIZE() {
            return 90;
        }

        constructor(url) {
            $assert(url, 'topic can not be null');

            this._image = new ImageElement();
            this._image.setHref(url);
            this._image.setSize(this.BASE_SIZE, this.BASE_SIZE);
        }

        get image() {
            return this._image;
        }

        set group(group) {
            this._group = group;
        }

        get group() {
            return this._group;
        }

        get size() {
            return this._image.getSize();
        }

        get position() {
            return this._image.getPosition();
        }

        addEvent(type, fnc) {
            this._image.addEvent(type, fnc);
        }

        remove() {
            throw "Unsupported operation";
        }
    }

    return Icon;
});
