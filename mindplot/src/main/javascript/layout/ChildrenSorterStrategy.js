mindplot.layout.ChildrenSorterStrategy = new Class(/** @lends ChildrenSorterStrategy */{
    /**
     * @constructs
     */
    initialize: function() {},

    /** @abstract */
    computeChildrenIdByHeights: function(treeSet, node) {
        throw "Method must be implemented";
    },

    /** @abstract */
    computeOffsets: function(treeSet, node) {
        throw "Method must be implemented";
    },

    /** @abstract */
    insert: function(treeSet, parent, child, order) {
        throw "Method must be implemented";
    },

    /** @abstract */
    detach: function(treeSet, node) {
        throw "Method must be implemented";
    },

    /** @abstract */
    predict: function(treeSet, parent, node, position, free) {
        throw "Method must be implemented";
    },

    /** @abstract */
    verify: function(treeSet, node) {
        throw "Method must be implemented";
    },

    /** @abstract */
    getChildDirection: function(treeSet, node) {
        throw "Method must be implemented";
    },

    /** @abstract */
    toString: function() {
        throw "Method must be implemented: print name";
    }
});
