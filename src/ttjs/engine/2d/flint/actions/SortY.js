"use strict";
/**
 * TODO
 */
define([], function () {
    "use strict";
    var SortY = function (offset) {
        this.offset = offset;
    };
    SortY.prototype = {
        update: function (emitter, p, time) {
            p.sortValue = p.position.y + this.offset;
        }
    };
    return SortY;
});
//# sourceMappingURL=SortY.js.map