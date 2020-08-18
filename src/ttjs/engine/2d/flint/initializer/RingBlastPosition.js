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
    var RingBlastPosition = function (x, y, randRadiusX, randRadiusY, ringRadius, minVelocity, maxVelocity) {
        if (ringRadius === void 0) { ringRadius = 0; }
        this.randX = randRadiusX;
        this.randY = randRadiusY || randRadiusX;
        this.ringRadius = ringRadius;
        this.minVel = minVelocity || 0;
        this.maxVel = maxVelocity || this.minVel;
        this.pos = {
            x: x || 0,
            y: y || 0
        };
    };
    RingBlastPosition.prototype = {
        init: function (emitter, p) {
            var randAngle = Math.PI * 2 * Math.random();
            //p.rotation = randAngle;
            var velPower = (this.minVel + (this.maxVel - this.minVel) * Math.random());
            p.velocity.x = Math.cos(randAngle) * velPower;
            p.velocity.y = Math.sin(randAngle) * velPower;
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
    return RingBlastPosition;
});
//# sourceMappingURL=RingBlastPosition.js.map