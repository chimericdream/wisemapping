/* global define */
'use strict';

define([
    'element', 'font',
    'elements/arrow', 'elements/curved-line', 'elements/workspace',
    'toolkit'
], (
    Element, Font,

    ArrowElement, CurvedLineElement, EllipseElement,
    GroupElement, ImageElement, LineElement,
    PolyLineElement, RectElement, TextElement, WorkspaceElement,

    Toolkit
) => {
    return {
        'Element': Element,
        'elements': {
            'Arrow': ArrowElement,
            'CurvedLine': CurvedLineElement,
            'Ellipse': EllipseElement,
            'Group': GroupElement,
            'Image': ImageElement,
            'Line': LineElement,
            'PolyLine': PolyLineElement,
            'Rect': RectElement,
            'Text': TextElement,
            'Workspace': WorkspaceElement
        },
        'Font': Font,
        'peer': {
            'svg': {},
            'utils': {},
            'Toolkit': Toolkit,
            'ToolkitSVG': Toolkit
        }
    };
});
