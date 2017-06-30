mindplot.LocalStorageManager = new Class({
        Extends: mindplot.PersistenceManager,

        initialize: function(documentUrl, forceLoad) {
            this.parent();
            this.documentUrl = documentUrl;
            this.forceLoad = forceLoad;
        },

        saveMapXml: function(mapId, mapXml, pref, saveHistory, events) {
            localStorage.setItem(mapId + "-xml", mapXml);
        },

        discardChanges: function(mapId) {
            localStorage.removeItem(mapId + "-xml");
        },

        loadMapDom: function(mapId) {
            var xml = localStorage.getItem(mapId + "-xml");
            if (xml == null || this.forceLoad) {
                $.ajax({
                    url: this.documentUrl.replace("{id}", mapId),
                    headers: {"Content-Type": "text/plain", "Accept": "application/xml"},
                    type: 'get',
                    dataType: "text",
                    async: false,
                    success: function(response) {
                        xml = response;
                    }
                });
                // If I could not load it from a file, hard code one.
                if (xml == null) {
                    throw new Error("Map could not be loaded");
                }
            }

            return jQuery.parseXML(xml);
        },

        unlockMap: function(mindmap) {
            // Ignore, no implementation required ...
        }
    }
);
