/* global define */
'use strict';

define(['utils/is-defined'], ($defined) => {
    return (assert, message) => {
        if (!$defined(assert) || !assert) {
            throw new Error(message);
        }
    };
});
