mindplot.EventBus = new Class(/** @lends EventBus */{
    Implements: mindplot.Events,

    /**
     * @constructs
     * @implements mindplot.Events
     */
    initialize: function() {}
});

/**
 * Enum for events
 * @enum {String}
 */
mindplot.EventBus.events = {
    NodeResizeEvent:'NodeResizeEvent',
    NodeMoveEvent:'NodeMoveEvent',
    NodeShrinkEvent:'NodeShrinkEvent',
    NodeConnectEvent:'NodeConnectEvent',
    NodeDisconnectEvent:'NodeDisconnectEvent',
    NodeAdded:'NodeAdded',
    NodeRemoved:'NodeRemoved',
    DoLayout:'DoLayout'
};

/** instance */
mindplot.EventBus.instance = new mindplot.EventBus();
