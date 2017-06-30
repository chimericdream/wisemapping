/* global define */
'use strict';

define(() => {
    class Point {
        /**
         * @constructs
         * @param {Number} x coordinate
         * @param {Number} y coordinate
         */
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }

        /**
         * @param {Number} x coordinate
         * @param {Number} y coordinate
         */
        setValue(x, y) {
            this.x = x;
            this.y = y;
        }

        inspect() {
            return `{x: ${this.x}, y: ${this.y}}`;
        }

        clone() {
            return new Point(this.x, this.y);
        }

        fromString(point) {
            let values = point.split(',');
            return new Point(values[0], values[1]);
        }
    }

    return Point;
});
