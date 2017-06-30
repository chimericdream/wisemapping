web2d.peer.utils.EventUtils = {
    broadcastChangeEvent: function(elementPeer, type) {
        var listeners = elementPeer.getChangeEventListeners(type);
        if ($defined(listeners)) {
            for (var i = 0; i < listeners.length; i++) {
                var listener = listeners[i];
                listener.call(elementPeer, null);
            }
        }

        var children = elementPeer.getChildren();
        for (var j = 0; j < children.length; j++) {
            var child = children[j];
            web2d.peer.utils.EventUtils.broadcastChangeEvent(child, type);
        }
    }
};
