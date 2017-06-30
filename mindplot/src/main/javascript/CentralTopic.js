mindplot.CentralTopic = new Class(/** @lends CentralTopic*/{
    Extends: mindplot.Topic,

    /**
     * @extends mindplot.Topic
     * @constructs
     * @param model
     * @param options
     */
    initialize: function(model, options) {
        this.parent(model, options);
    },

    _registerEvents: function() {
        this.parent();

        // This disable the drag of the central topic. But solves the problem of deselecting the nodes when the screen is clicked.
        this.addEvent('mousedown', function(event) {
            event.stopPropagation();
        });
    },

    /** */
    workoutIncomingConnectionPoint: function() {
        return this.getPosition();
    },

    /** */
    setCursor: function(type) {
        type = (type == 'move') ? 'default' : type;
        this.parent(type);
    },

    /** */
    updateTopicShape: function() {},

    _updatePositionOnChangeSize: function() {
        // Center main topic ...
        var zeroPoint = new core.Point(0, 0);
        this.setPosition(zeroPoint);
    },

    /** */
    getShrinkConnector: function() {
        return null;
    },

    /** */
    workoutOutgoingConnectionPoint: function(targetPosition) {
        $assert(targetPosition, 'targetPoint can not be null');
        var pos = this.getPosition();
        var isAtRight = mindplot.util.Shape.isAtRight(targetPosition, pos);
        var size = this.getSize();
        return mindplot.util.Shape.calculateRectConnectionPoint(pos, size, !isAtRight);
    }
});
