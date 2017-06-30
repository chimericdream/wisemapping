mindplot.persistence.Beta2PelaMigrator = new Class({
    initialize: function(betaSerializer) {
        this._betaSerializer = betaSerializer;
        this._pelaSerializer = new mindplot.persistence.XMLSerializer_Pela();
    },

    toXML: function(mindmap) {
        return this._pelaSerializer.toXML(mindmap);
    },

    loadFromDom: function(dom, mapId) {
        $assert($defined(mapId), "mapId can not be null");
        var mindmap = this._betaSerializer.loadFromDom(dom, mapId);
        mindmap.setVersion(mindplot.persistence.ModelCodeName.PELA);

        // Beta does not set position on second level nodes ...
        var branches = mindmap.getBranches();
        var me = this;
        _.each(branches, function(model) {
            me._fixPosition(model);
        });

        return mindmap;
    },

    _fixPosition: function(parentModel) {
        var parentPos = parentModel.getPosition();
        var isRight = parentPos.x > 0;
        var me = this;
        _.each(parentModel.getChildren(), function(child) {
            if (!child.getPosition()) {
                child.setPosition(parentPos.x + (50 * isRight ? 1 : -1), parentPos.y);
            }
            me._fixPosition(child);
        });
    }
});
