/* global define */
'use strict';

define(() => {
    class Events {
        constructor() {
            this.$events = {};
        }

        _removeOn(string) {
            return string.replace(/^on([A-Z])/, function(full, first) {
                return first.toLowerCase();
            });
        }

        addEvent(type, fn, internal) {
            type = this._removeOn(type);

            this.$events[type] = (this.$events[type] || []).include(fn);
            if (internal) {
                fn.internal = true;
            }
            return this;
        }

        fireEvent(type, args, delay) {
            type = this._removeOn(type);
            let events = this.$events[type];

            if (!events) {
                return this;
            }

            args = Array.from(args);
            _.each(events, (fn) => {
                if (delay) {
                    fn.delay(delay, this, args);
                } else {
                    fn.apply(this, args);
                }
            });

            return this;
        }

        removeEvent(type, fn) {
            type = this._removeOn(type);
            let events = this.$events[type];
            if (events && !fn.internal) {
                let index = events.indexOf(fn);
                if (index != -1) {
                    events.splice(index, 1);
                }
            }
            return this;
        }
    }

    return Events;
});
