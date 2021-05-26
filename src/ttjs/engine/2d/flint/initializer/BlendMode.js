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
 * Copyright (c) 2019, Christoph Schnackenberg <bluechs@gmx.de>
 *
 *
 *
 */
// define([
// ], function(
// )
// {
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BlendMode = void 0;
    /**
     * Posible options:
     *
     * https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Compositing
     *
     * source-over
     * source-in
     * source-out
     * source-atop
     * destination-over
     * destination-in
     * destination-out
     * destination-atop
     * lighter or add
     * copy
     * xor
     * multiply
     * screen
     * overlay
     * darken or subtract
     * lighten
     * color-dodge
     * color-burn
     * hard-light
     * soft-light
     * difference
     * exclusion
     * hue
     * saturation
     * color
     * luminosity
     *
     *
     * @param mode
     * @constructor
     */
    function BlendMode(mode) {
        this.mode = mode || null;
        switch (this.mode) {
            case "add":
                this.mode = "lighter";
                break;
            case "subtract":
                this.mode = "darken";
                break;
        }
    }
    exports.BlendMode = BlendMode;
    ;
    BlendMode.prototype = {
        init: function (emitter, p) {
            p.compositeOperation = this.mode;
        }
    };
});
//     return BlendMode;
// });
//# sourceMappingURL=BlendMode.js.map