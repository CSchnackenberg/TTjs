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
import * as PIXI from '@ttjs/lib/pixi-legcay'
import rgb2hex = PIXI.utils.rgb2hex;

interface ParticlePos {
    x:number,
    y:number,
}

interface ParticleColor {
    r:number,
    g:number,
    b:number,
    a:number,
}

export class Particle {

    public mixColor:number[];
    public scale:ParticlePos;
    public position:ParticlePos;
    public lastPosition:ParticlePos;
    public velocity:ParticlePos;
    public mass:number;
    public lifetime:number;
    public age:number;
    public energy:number;
    public isDead:boolean;
    public rotation:number;
    public rotVelocity:number;
    public collisionRadius:number;
    public sortValue:number;
    public sprite:PIXI.AnimatedSprite;
    public blendMode:PIXI.BLEND_MODES;



    constructor() {
        this.mixColor  = [1, 1, 1, 1];
        this.scale = {x: 1, y: 1};
        this.position = {x: 0, y:0};
        this.lastPosition = {x: 0, y:0};
        this.velocity = {x: 0, y:0};
        this.reset();
    }

    reset() {
        this.mixColor[0] = 1;
        this.mixColor[1] = 1;
        this.mixColor[2] = 1;
        this.mixColor[3] = 1;
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
        this.age=0;
        this.energy = 1;
        this.isDead = false;
        this.rotation = 0;
        this.rotVelocity = 0;
        this.collisionRadius = 1;
        this.sortValue = 0;
        this.sprite = null;
        this.blendMode = PIXI.BLEND_MODES.ADD;
    }

    getInertia() {
        return this.mass * this.collisionRadius * this.collisionRadius * 0.5;
    };

    applyToSprite() {
        if (!this.sprite)
            return;


        this.sprite.rotation = this.rotation;
        this.sprite.scale.set(this.scale.x, this.scale.y);
        this.sprite.x = this.position.x;
        this.sprite.y = this.position.y;
        this.sprite.alpha = this.mixColor[3];
        this.sprite.blendMode = this.blendMode; //; compositeOperation = this.compositeOperation;

        this.sprite.tint = rgb2hex(this.mixColor);
        // color mix?
    };

}

// export function Particle() {
//     this.mixColor  = {r:1,g:1,b:1,a:1};
//     this.scale = {x: 1, y: 1};
//     this.position = {x: 0, y:0};
//     this.lastPosition = {x: 0, y:0};
//     this.velocity = {x: 0, y:0};
//
//     this.reset();
// }


// Particle.prototype.reset = function() {
//     this.mixColor.r = 1;
//     this.mixColor.g = 1;
//     this.mixColor.b = 1;
//     this.mixColor.a = 1;
//     this.scale.x = 1;
//     this.scale.y = 1;
//     this.position.x = 0;
//     this.position.y = 0;
//     this.lastPosition.x = 0;
//     this.lastPosition.y = 0;
//     this.velocity.x = 0;
//     this.velocity.y = 0;
//
//     this.mass = 1;
//     this.lifetime = 0;
//     this.age=0;
//     this.energy = 1;
//     this.isDead = false;
//     this.rotation = 0;
//     this.rotVelocity = 0;
//     this.collisionRadius = 1;
//     this.sortValue = 0;
//     this.sprite = null;
//     this.compositeOperation = null;
// };
// Particle.prototype.getInertia = function() {
//     return this.mass * this.collisionRadius * this.collisionRadius * 0.5;
// };
//
// Particle.prototype.applyToSprite = function() {
//     if (!this.sprite)
//         return;
//
//
//     this.sprite.rotation = this.rotation;
//     this.sprite.scaleX = this.scale.x;
//     this.sprite.scaleY = this.scale.y;
//     this.sprite.x = this.position.x;
//     this.sprite.y = this.position.y;
//     this.sprite.alpha = this.mixColor.a;
//     this.sprite.compositeOperation = this.compositeOperation;
//
//     // color mix?
// };
//
