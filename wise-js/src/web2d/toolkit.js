/* global define */
'use strict';

define(['peer/svg/arrow', 'peer/svg/curved-line', 'peer/svg/element', 'peer/svg/ellipse', 'peer/svg/font', 'peer/svg/font-arial', 'peer/svg/font-tahoma', 'peer/svg/font-times', 'peer/svg/font-verdana', 'peer/svg/group', 'peer/svg/image', 'peer/svg/line', 'peer/svg/poly-line', 'peer/svg/rect', 'peer/svg/text', 'peer/svg/workspace'], (Arrow, CurvedLine, Element, Ellipse, Font, FontArial, FontTahoma, FontTimes, FontVerdana, Group, Image, Line, PolyLine, Rect, Text, Workspace) => {
    class Toolkit {
        static createWorkspace(element) {
            return new Workspace(element);
        }

        static createGroup() {
            return new Group();
        }

        static createElipse() {
            return new Elipse();
        }

        static createLine() {
            return new Line();
        }

        static createPolyLine() {
            return new PolyLine();
        }

        static createCurvedLine() {
            return new CurvedLine();
        }

        static createArrow() {
            return new Arrow();
        }

        static createText() {
            return new Text();
        }

        static createImage() {
            return new Image();
        }

        static createRect(arc) {
            return new Rect(arc);
        }

        static createFont(fontName) {
            switch (fontName) {
                case 'Arial':
                    return new FontArial();
                case 'Times':
                    return new FontTimes();
                case 'Verdana':
                    return new FontVerdana();
                case 'Tahoma':
                    return new FontTahoma();
                default:
                    //@TODO: throw
            }
        }
    }

    return Toolkit;
});
