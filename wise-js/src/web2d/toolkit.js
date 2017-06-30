/* global define */
'use strict';

define([
    'web2d/peer/svg/arrow',
    'web2d/peer/svg/curved-line',
    'web2d/peer/svg/element',
    'web2d/peer/svg/ellipse',
    'web2d/peer/svg/font',
    'web2d/peer/svg/font-arial',
    'web2d/peer/svg/font-tahoma',
    'web2d/peer/svg/font-times',
    'web2d/peer/svg/font-verdana',
    'web2d/peer/svg/group',
    'web2d/peer/svg/image',
    'web2d/peer/svg/line',
    'web2d/peer/svg/poly-line',
    'web2d/peer/svg/rect',
    'web2d/peer/svg/text',
    'web2d/peer/svg/workspace'
],
(
    Arrow,
    CurvedLine,
    Element,
    Ellipse,
    Font,
    FontArial,
    FontTahoma,
    FontTimes,
    FontVerdana,
    Group,
    Image,
    Line,
    PolyLine,
    Rect,
    Text,
    Workspace
) => {
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
