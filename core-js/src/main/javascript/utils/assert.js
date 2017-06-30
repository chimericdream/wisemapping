/* global define */
'use strict';

/**
 * Function: $defined
 * Returns true if the passed in value/object is defined, that means is not null or undefined.
 *
 * Arguments:
 * obj - object to inspect
 */
define(['utils/is-defined'], ($defined) => {
    return (assert, message) => {
        if (!$defined(assert) || !assert) {
            throw new Error(message);
        }
    };
});
