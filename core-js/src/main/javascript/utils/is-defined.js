/* global define */
'use strict';

/**
 * Function: $defined
 * Returns true if the passed in value/object is defined, that means is not null or undefined.
 *
 * Arguments:
 * obj - object to inspect
 */
define('is-defined', () => {
    return (obj) => {
        return ((typeof obj !== 'undefined') && (obj != undefined));
    };
});
