/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 * 
 * Copyright (c) 2013, Christoph Schnackenberg <bluechs@gmx.de>
 *
 * Addition to FLINT particles
 * 
 */
// define([
// ], function(
// ) {

"use strict";
export function RectPosition(x, y, randX, randY) {
    this.randX = randX;
    this.randY = randY;

    this.pos = {
        x: x || 0,
        y: y || 0
    };
};

RectPosition.prototype = {
    init: function(emitter, p) {
        p.position.x += this.pos.x + Math.random() * this.randX;
        p.position.y += this.pos.y + Math.random() * this.randY;
    }
};
    
//     return RectPosition;
// });