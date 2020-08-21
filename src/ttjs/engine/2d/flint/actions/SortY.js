/**
 * TODO
 */
// define([
// ], function(
// )
// {
define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.SortY = void 0;
    function SortY(offset) {
        this.offset = offset;
    }
    exports.SortY = SortY;
    ;
    SortY.prototype = {
        update: function (emitter, p, time) {
            p.sortValue = p.position.y + this.offset;
        }
    };
});
//     return SortY;
// });
//# sourceMappingURL=SortY.js.map