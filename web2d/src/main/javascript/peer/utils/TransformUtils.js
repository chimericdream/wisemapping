web2d.peer.utils.TransformUtil = {
    workoutScale: function(elementPeer) {
        var current = elementPeer.getParent();
        var width = 1;
        var height = 1;
        while (current) {
            var coordSize = current.getCoordSize();
            var size = current.getSize();

            width = width * (parseInt(size.width) / coordSize.width);
            height = height * (parseInt(size.height) / coordSize.height);
            current = current.getParent();
        }

        return {width: width, height: height};
    }
};
