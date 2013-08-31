/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2013, Christoph Schnackenberg <bluchs@gmx.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 */
define([
], function(
)
{    
	"use strict";
    var FxLayer = function() {
		this._children = [];
        this.parent = null;
        this.name = "";
        
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
        _calcViewport: function(fxContext) {            
            this._vp.x = fxContext.viewport.x;
            this._vp.y = fxContext.viewport.y;
            this._vp.w = fxContext.viewport.w;
            this._vp.h = fxContext.viewport.h;
            return this._vp;
        },
        /**
         * Draws the layer and all children
         * @param {FxContext} fxContext        
         */
        draw: function(fxContext) {
            this._drawLayer(fxContext);            
            var num = this._children.length;            
            for (var i=0; i<num; i++) {
                this._children[i].draw(fxContext);                
            }
        },
        /**
         * 
         * @private
         * @param {type} fxContext
         * @returns {undefined}
         */
        _drawLayer: function(fxContext) {
            // overwrite 
        }
    };
        
	return FxLayer;
});
