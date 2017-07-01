/* global define */
'use strict';

define([
    'web2d/element', 'web2d/font',
    'web2d/elements/arrow', 'web2d/elements/curved-line', 'web2d/elements/workspace',
    'web2d/toolkit'
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
