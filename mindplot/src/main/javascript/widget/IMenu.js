mindplot.widget.IMenu = new Class({
    initialize: function(designer, containerId, mapId) {
        $assert(designer, "designer can not be null");
        $assert(containerId, "containerId can not be null");

        this._designer = designer;
        this._toolbarElems = [];
        this._containerId = containerId;
        this._mapId = mapId;
        this._mindmapUpdated = false;
        var me = this;
        // Register update events ...
        this._designer.addEvent('modelUpdate', function() {
            me.setRequireChange(true);
        });
    },

    clear: function() {
        _.each(this._toolbarElems, function(item) {
            item.hide();
        });
    },

    discardChanges: function(designer) {
        // Avoid autosave before leaving the page ....
        this.setRequireChange(false);

        // Finally call discard function...
        var persistenceManager = mindplot.PersistenceManager.getInstance();
        var mindmap = designer.getMindmap();
        persistenceManager.discardChanges(mindmap.getId());

        // Unlock map ...
        this.unlockMap(designer);

        // Reload the page ...
        window.location.reload();
    },

    unlockMap: function(designer) {
        var mindmap = designer.getMindmap();
        var persistenceManager = mindplot.PersistenceManager.getInstance();
        persistenceManager.unlockMap(mindmap);
    },

    save: function(saveElem, designer, saveHistory, sync) {
        // Load map content ...
        var mindmap = designer.getMindmap();
        var mindmapProp = designer.getMindmapProperties();

        // Display save message ..
        if (saveHistory) {
            $notify($msg('SAVING'));
            saveElem.css('cursor', 'wait');
        }

        // Call persistence manager for saving ...
        var menu = this;
        var persistenceManager = mindplot.PersistenceManager.getInstance();
        persistenceManager.save(mindmap, mindmapProp, saveHistory, {
            onSuccess: function() {
                if (saveHistory) {
                    saveElem.css('cursor', 'pointer');
                    $notify($msg('SAVE_COMPLETE'));
                }
                menu.setRequireChange(false);
            },

            onError: function(error) {
                if (saveHistory) {
                    saveElem.css('cursor', 'pointer');

                    if (error.severity != "FATAL") {
                        $notify(error.message);
                    } else {
                        $notifyModal(error.message);
                    }
                }
            }
        }, sync);
    },

    isSaveRequired: function() {
        return this._mindmapUpdated;
    },

    setRequireChange: function(value) {
        this._mindmapUpdated = value;
    }
});
