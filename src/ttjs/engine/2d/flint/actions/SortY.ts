/**
 * TODO
 */
// define([
// ], function(
// )
// {

"use strict";
export function SortY(offset) {
    this.offset = offset;
};

SortY.prototype = {
    update: function(emitter, p, time) {
        p.sortValue = p.position.y + this.offset;
    }
};
    
//     return SortY;
// });