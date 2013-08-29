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
    'ttjs/engine/2d/fxlayer/FxLayer',
    'ttjs/lib/easeljs-0.6.0.min'
], function(
    env,
    FxLayer,
    Fx
)
{    
	"use strict";
    var FxSpriteLayer = function(canvas) {        
        FxLayer.call(this); // < super()        
        this.stage = new Fx.Stage(canvas);        
        Fx.Touch.enable(this.stage);
        this.stage.autoClear = false;         
        this._root = new Fx.Container();
        this.stage.addChild(this._root);                
	};
    env.inherits(FxSpriteLayer, FxLayer);;

    FxSpriteLayer.prototype._drawLayer = function(fxContext) {            
        this.stage.update(); 
    };        
    FxSpriteLayer.prototype.getRoot = function() {        
        return this._root;
    };        
        
	return FxSpriteLayer;
});
