mindplot.PersistenceManager = new Class({
    Static: {
        loadFromDom: function(mapId, mapDom) {
            $assert(mapId, "mapId can not be null");
            $assert(mapDom, "mapDom can not be null");

            var serializer = mindplot.persistence.XMLSerializerFactory.getSerializerFromDocument(mapDom);
            return serializer.loadFromDom(mapDom, mapId);
        }
    },

    initialize: function() {},

    save: function(mindmap, editorProperties, saveHistory, events, sync) {
        $assert(mindmap, "mindmap can not be null");
        $assert(editorProperties, "editorProperties can not be null");

        var mapId = mindmap.getId();
        $assert(mapId, "mapId can not be null");

        var serializer = mindplot.persistence.XMLSerializerFactory.getSerializerFromMindmap(mindmap);
        var domMap = serializer.toXML(mindmap);
        var mapXml = core.Utils.innerXML(domMap);

        var pref = JSON.stringify(editorProperties);
        try {
            this.saveMapXml(mapId, mapXml, pref, saveHistory, events, sync);
        } catch (e) {
            console.log(e);
            events.onError(this._buildError());
        }
    },

    load: function(mapId) {
        $assert(mapId, "mapId can not be null");
        var domDocument = this.loadMapDom(mapId);
        return mindplot.PersistenceManager.loadFromDom(mapId, domDocument);
    },

    discardChanges: function(mapId) {
        throw new Error("Method must be implemented");
    },

    loadMapDom: function(mapId) {
        throw new Error("Method must be implemented");
    },

    saveMapXml: function(mapId, mapXml, pref, saveHistory, events, sync) {
        throw new Error("Method must be implemented");
    },

    unlockMap: function(mindmap) {
        throw new Error("Method must be implemented");
    }
});

mindplot.PersistenceManager.init = function(instance) {
    mindplot.PersistenceManager._instance = instance;
};

mindplot.PersistenceManager.getInstance = function() {
    return mindplot.PersistenceManager._instance;
};
