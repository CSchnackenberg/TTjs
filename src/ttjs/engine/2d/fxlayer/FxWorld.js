/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2013, Christoph Schnackenberg <bluechs@gmx.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 */
define(["require", "exports", "@ttjs/engine/2d/fxlayer/FxLayer"], function (require, exports, FxLayer_1) {
    // define([
    // 	'ttjs/engine/2d/fxlayer/FxLayer'
    // ], function(
    //     FxLayer
    // )
    // {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FxWorld = void 0;
    /**
     *
     * @param {TileRenderer} A TileRenderer object from 'ttjs/engine/2d/tileRenderer'
     * @returns {FxWorld}
     */
    function FxWorld(tileRenderer, mapRenderModel) {
        this._root = new FxLayer_1.FxLayer();
        this.tileRenderer = tileRenderer;
        this.mapRenderModel = mapRenderModel;
    }
    exports.FxWorld = FxWorld;
    ;
    FxWorld.prototype = {
        initCanvas: function (canvas, ctx) {
            this.canvas = canvas;
            this.ctx = ctx;
            this.viewport = {
                x: 0,
                y: 0,
                w: this.canvas.width,
                h: this.canvas.height
            };
        },
        draw: function () {
            this._root.draw(this);
        },
        getRoot: function () {
            return this._root;
        }
    };
});
// return FxWorld;
// });
//# sourceMappingURL=FxWorld.js.map