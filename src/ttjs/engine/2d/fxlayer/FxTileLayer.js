/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2013, Christoph Schnackenberg <bluechs@gmx.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 */
define([
	'env',
    'ttjs/engine/2d/fxlayer/FxLayer'
], function(
    env,
    FxLayer
)
{    
	"use strict";
    var FxTileLayer = function(layerModel, layerIndex) {        
        FxLayer.call(this); // < super()        
		this.layerModel = layerModel;
        this.layerIndex = layerIndex;
        this.position =  {
			dest: {
				x: 0,
				y: 0
			},
			src: {
				x: 0,
				y: 0
			},
			seemless: {
				x: true,
				y: true
			}
		};
	};
    env.inherits(FxTileLayer, FxLayer);
    
    FxTileLayer.prototype._drawLayer = function(fxWorld) {  
        
        var vp = this._calcViewport(fxWorld);
        this.position.src.x = Math.floor(vp.x);
        this.position.src.y = Math.floor(vp.y);
        
        fxWorld.tileRenderer.drawLayer(
            fxWorld.ctx,           
            fxWorld.mapRenderModel,
            this.layerIndex,
            this.position
        );
    }        
    
	return FxTileLayer;
});
