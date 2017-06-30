/* global define */
'use strict';

define(['peer/svg/arrow', 'peer/svg/curved-line', 'peer/svg/element', 'peer/svg/ellipse', 'peer/svg/font', 'peer/svg/font-arial', 'peer/svg/font-tahoma', 'peer/svg/font-times', 'peer/svg/font-verdana', 'peer/svg/group', 'peer/svg/image', 'peer/svg/line', 'peer/svg/poly-line', 'peer/svg/rect', 'peer/svg/text', 'peer/svg/workspace'], (Arrow, CurvedLine, Element, Ellipse, Font, FontArial, FontTahoma, FontTimes, FontVerdana, Group, Image, Line, PolyLine, Rect, Text, Workspace) => {
    class Toolkit {
        constructor() {
        }

        createWorkspace(element) {
            return new Workspace(element);
        }

        createGroup() {
            return new Group();
        }

        createElipse() {
            return new Elipse();
        }

        createLine() {
            return new Line();
        }

        createPolyLine() {
            return new PolyLine();
        }

        createCurvedLine() {
            return new CurvedLine();
        }

        createArrow() {
            return new Arrow();
        }

        createText() {
            return new Text();
        }

        createImage() {
            return new Image();
        }

        createRect(arc) {
            return new Rect(arc);
        }

        createArialFont() {
            return new FontArial();
        }

        createTimesFont() {
            return new FontTimes();
        }

        createVerdanaFont() {
            return new FontVerdana();
        }

        createTahomaFont() {
            return new FontTahoma();
        }
    }

    return Toolkit;
});
