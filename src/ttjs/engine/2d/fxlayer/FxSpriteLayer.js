/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2013, Christoph Schnackenberg <bluechs@gmx.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 *
 * TODO check easeljs 1.0 update
 * TODO make sure that Fx.Touch.disabled() is called
 */
define([
	'ttjs/util/TTTools',
    'ttjs/engine/2d/fxlayer/FxLayer',
    'ttjs/lib/easeljs-1.0.0.min'
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
    env.inherits(FxSpriteLayer, FxLayer);

    FxSpriteLayer.prototype._drawLayer = function(fxWorld) {
                
        var vp = this._calcViewport(fxWorld);
        this._root.x = -vp.x;
        this._root.y = -vp.y;
        
        this.stage.update(); 
    };        
    FxSpriteLayer.prototype.getRoot = function() {        
        return this._root;
    };        
        
	return FxSpriteLayer;
});
