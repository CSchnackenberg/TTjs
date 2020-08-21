/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2013, Christoph Schnackenberg <bluechs@gmx.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 */

// define([
// 	'ttjs/engine/2d/fxlayer/FxLayer'
// ], function(
//     FxLayer
// )
// {

"use strict";

import {FxLayer} from "@ttjs/engine/2d/fxlayer/FxLayer";


    
/**
 *
 * @param {TileRenderer} A TileRenderer object from 'ttjs/engine/2d/tileRenderer'
 * @returns {FxWorld}
 */
export function FxWorld(tileRenderer, mapRenderModel) {
    this._root = new FxLayer();
    this.tileRenderer = tileRenderer;
    this.mapRenderModel = mapRenderModel;
};

FxWorld.prototype = {
    initCanvas: function(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.viewport = {
            x: 0,
            y: 0,
            w: this.canvas.width,
            h: this.canvas.height
        };
    },
    draw: function() {
        this._root.draw(this);
    },
    getRoot: function() {
        return this._root;
    }
};

// return FxWorld;
// });
