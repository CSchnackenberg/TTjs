"use strict";
/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2013, Christoph Schnackenberg <bluechs@gmx.de>
 *
 * Addition to FLINT particles
 *
 */
define([], function () {
    "use strict";
    var CirclePosition = function (x, y, randRadiusX, randRadiusY, ringRadius) {
        if (ringRadius === void 0) { ringRadius = 0; }
        this.randX = randRadiusX;
        this.randY = randRadiusY || randRadiusX;
        this.ringRadius = ringRadius;
        this.pos = {
            x: x || 0,
            y: y || 0
        };
    };
    CirclePosition.prototype = {
        init: function (emitter, p) {
            var randAngle = Math.PI * 2 * Math.random();
            if (this.ringRadius > 0) {
                p.position.x += this.pos.x + Math.cos(randAngle) * this.randX + this.ringRadius * Math.random();
                p.position.y += this.pos.y + Math.sin(randAngle) * this.randY + this.ringRadius * Math.random();
            }
            else {
                p.position.x += this.pos.x + Math.cos(randAngle) * this.randX * Math.random();
                p.position.y += this.pos.y + Math.sin(randAngle) * this.randY * Math.random();
            }
        }
    };
    return CirclePosition;
});
//# sourceMappingURL=CirclePosition.js.map