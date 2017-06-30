/* global define */
'use strict';

define([
    'mindplot/events',
    'mindplot/events/action-dispatcher',
    'mindplot/events/designer',
    'mindplot/icon'
], (
    Events,
    EventsActionDispatcher,
    EventsDesigner,
    Icon
) => {
    return {
        'ActionDispatcher': EventsActionDispatcher,
        'Events': Events,
        'Designer': EventsDesigner,

        'Icon': Icon,

        'util': {},
        'commands': {},
        'layout': {
            'boards': {
                'original': {}
            }
        },
        'widget': {},
        'model': {},
        'collaboration': {
            'framework': {}
        },
        'persistence': {}
    };
});
