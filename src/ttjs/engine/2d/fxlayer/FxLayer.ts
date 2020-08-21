/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2013, Christoph Schnackenberg <bluchs@gmx.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 */
// define([
// ], function(
// )
// {

"use strict";
export function FxLayer() {
    this._children = [];
    this.parent = null;
    this.name = "";

    this.parallax = {x: 1, y: 1};
    this._vp = {
        x: 0,
        y: 0,
        w: 0,
        h: 0
    };
};

FxLayer.prototype = {
    getNumChildren: function() {
        return this._children.lenght;
    },
    addChild: function(fxlayer) {
        this._children.push(fxlayer);
        fxlayer.parent = this;
    },
    removeChild: function(fxlayer) {
        console.error("FxLayer.removeChild: NOT IMPLEMENTED!");
    },
    findChild: function(name) {
        var num = this._children.length;
        for (var i=0; i<num; i++) {
            if (this._children[i].name === name)
                return this._children[i];
        }
        return null;
    },
    _calcViewport: function(fxWorld) {
        this._vp.x = fxWorld.viewport.x * this.parallax.x;
        this._vp.y = fxWorld.viewport.y * this.parallax.y;
        this._vp.w = fxWorld.viewport.w;
        this._vp.h = fxWorld.viewport.h;
        return this._vp;
    },
    /**
     * Draws the layer and all children
     * @param {FxWorld} fxWorld
     */
    draw: function(fxWorld) {
        this._drawLayer(fxWorld);
        var num = this._children.length;
        for (var i=0; i<num; i++) {
            this._children[i].draw(fxWorld);
        }
    },
    /**
     *
     * @private
     * @param {type} fxWorld
     * @returns {undefined}
     */
    _drawLayer: function(fxWorld) {
        // overwrite
    }
};
        
// 	return FxLayer;
// });
