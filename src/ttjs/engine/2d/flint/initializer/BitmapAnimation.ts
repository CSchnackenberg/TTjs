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
// define([
//     'ttjs/lib/easeljs'
// ], function(
//     Fx
// )
// {

import * as Fx from '@ttjs/lib/easeljs'

"use strict";
export function BitmapAnimation(spriteSheet, frameRangeStart, frameRangeEnd) {

    if (Array.isArray(frameRangeStart)) {
        this.animRange = frameRangeStart;
    }
    else if (isNaN(frameRangeStart)) {
        this.animName = frameRangeStart;
    }
    else {
        this.s = frameRangeStart || 0;
        this.e = frameRangeEnd || this.s;
    }
    this.sheet = spriteSheet;
};

BitmapAnimation.prototype = {
    init: function(emitter, p) {

        if (p.sprite) {
            p.sprite.initAfterReset(this.sheet);
        }
        else {
            p.sprite = new Fx.Sprite(this.sheet);
        }
        if (this.animName) {
            p.sprite.gotoAndPlay(this.animName);
        }
        else if (this.animRange) {
            const index = Math.floor(Math.random() * (this.animRange.length))
            p.sprite.gotoAndPlay(this.animRange[index]);
        }
        else {
            var frameNmb = this.s + Math.floor(Math.random() * (this.e - this.s));
            p.sprite.gotoAndStop(frameNmb);
        }
    }
};
    
//     return BitmapAnimation;
// });