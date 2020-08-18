"use strict";
/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * ==================================================
 *
 * FLINT PARTICLE SYSTEM
 * .....................
 *
 *
 * Author: Richard Lord
 * Copyright (c) Richard Lord 2008-2011
 * http://flintparticles.org
 *
 *
 * Licence Agreement
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * ==================================================
 *
 * Port to Javascript and modifications:
 *
 * Copyright (c) 2013, Christoph Schnackenberg <bluechs@gmx.de>
 *
 */
define([], function () {
    "use strict";
    var Particle = function () {
        this.mixColor = { r: 1, g: 1, b: 1, a: 1 };
        this.scale = { x: 1, y: 1 };
        this.position = { x: 0, y: 0 };
        this.lastPosition = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
        this.reset();
    };
    Particle.prototype.reset = function () {
        this.mixColor.r = 1;
        this.mixColor.g = 1;
        this.mixColor.b = 1;
        this.mixColor.a = 1;
        this.scale.x = 1;
        this.scale.y = 1;
        this.position.x = 0;
        this.position.y = 0;
        this.lastPosition.x = 0;
        this.lastPosition.y = 0;
        this.velocity.x = 0;
        this.velocity.y = 0;
        this.mass = 1;
        this.lifetime = 0;
        this.age = 0;
        this.energy = 1;
        this.isDead = false;
        this.rotation = 0;
        this.rotVelocity = 0;
        this.collisionRadius = 1;
        this.sortValue = 0;
        this.sprite = null;
        this.compositeOperation = null;
    };
    Particle.prototype.getInertia = function () {
        return this.mass * this.collisionRadius * this.collisionRadius * 0.5;
    };
    Particle.prototype.applyToSprite = function () {
        if (!this.sprite)
            return;
        this.sprite.rotation = this.rotation;
        this.sprite.scaleX = this.scale.x;
        this.sprite.scaleY = this.scale.y;
        this.sprite.x = this.position.x;
        this.sprite.y = this.position.y;
        this.sprite.alpha = this.mixColor.a;
        this.sprite.compositeOperation = this.compositeOperation;
        // color mix?
    };
    return Particle;
});
//# sourceMappingURL=Particle.js.map