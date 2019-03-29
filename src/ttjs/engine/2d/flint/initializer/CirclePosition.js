/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 * 
 * Copyright (c) 2013, Christoph Schnackenberg <bluechs@gmx.de>
 *
 * Addition to FLINT particles
 * 
 */
define([
], function(
) {
    "use strict";
    var CirclePosition = function(x, y, randRadiusX, randRadiusY) {
        this.randX = randRadiusX;
        this.randY = randRadiusY || randRadiusX;

        this.pos = {
            x: x || 0,
            y: y || 0
        };
    };

    CirclePosition.prototype = {
        init: function(emitter, p) {
            const randAngle = Math.PI*2*Math.random();
            p.position.x += this.pos.x + Math.cos(randAngle) * this.randX * Math.random();
            p.position.y += this.pos.y + Math.sin(randAngle) * this.randY * Math.random();
        }    
    };
    
    return CirclePosition;
});