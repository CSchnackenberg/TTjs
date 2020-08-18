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
    function Blast(maxCount, started) {
        this.maxCount = maxCount;
        this._started = started || true;
        this._blasted = false;
    }
    ;
    Blast.prototype = {
        startEmitter: function (e) {
            return 0;
        },
        spawnParticles: function (e, time) {
            if (this._blasted || !this._started)
                return 0;
            this._blasted = true;
            return this.maxCount;
        },
        isCompleted: function () {
            return false;
        },
        start: function () {
            this._started = true;
            this._blasted = false;
        },
        stop: function () {
            this._started = false;
        }
    };
    return Blast;
});
//# sourceMappingURL=Blast.js.map