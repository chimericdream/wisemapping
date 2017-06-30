/* global define, window */
'use strict';

define(['utils/is-defined'], ($defined) => {
    const Utils = {};

    Utils.innerXML = (node) => {
        if ($defined(node.innerXML)) {
            return node.innerXML;
        } else if ($defined(node.xml)) {
            return node.xml;
        } else if ($defined(XMLSerializer)) {
            return (new XMLSerializer()).serializeToString(node);
        }
    };

    Utils.createDocument = () => {
        return window.document.implementation.createDocument('', '', null);
    };

    return Utils;
});
