/* global define */
'use strict';

define(['element', 'toolkit'], (Element, Toolkit) => {
    return {
        'Element': Element,
        'peer': {
            'svg': {},
            'utils': {},
            'Toolkit': Toolkit,
            'ToolkitSVG': Toolkit
        }
    };
});
