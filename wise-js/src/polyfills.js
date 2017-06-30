/* global define, Math */
'use strict';

define(() => {
    Math.sign = (value) => {
        return (value >= 0) ? 1 : -1;
    };
});
