/* global define */
'use strict';

define(() => {
    class TransformUtils {
        static workoutScale(elementPeer) {
            let current = elementPeer.getParent();
            let width = 1;
            let height = 1;

            while (current) {
                let coordSize = current.getCoordSize();
                let size = current.getSize();

                width = width * (parseInt(size.width) / coordSize.width);
                height = height * (parseInt(size.height) / coordSize.height);
                current = current.getParent();
            }

            return {'width': width, 'height': height};
        }
    }

    return TransformUtils;
});
