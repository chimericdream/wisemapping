/* global define */
'use strict';

define(['utils/is-defined'], ($defined) => {
    class EventUtils {
        static broadcastChangeEvent(elementPeer, type) {
            let listeners = elementPeer.getChangeEventListeners(type);
            if ($defined(listeners)) {
                listeners.forEach((listener) => {
                    listener.call(elementPeer, null);
                });
            }

            let children = elementPeer.getChildren();
            children.forEach((child) => {
                EventUtils.broadcastChangeEvent(child, type);
            });
        }
    }

    return EventUtils;
});
