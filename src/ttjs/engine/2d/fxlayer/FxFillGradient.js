/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2013, Christoph Schnackenberg <bluechs@gmx.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 */
define([
	'ttjs/util/TTTools',
    'ttjs/engine/2d/fxlayer/FxLayer',
    'ttjs/lib/easeljs'
], function(
    env,
    FxLayer,
    Fx
)
{    
	"use strict";
    var FxFillGradient = function(canvas) { 
        FxLayer.call(this); // < super()  
        this.stage = new Fx.Stage(canvas);        
        Fx.Touch.enable(this.stage);
        this.stage.autoClear = false;        
        if (!this.shape) {
            this.shape = new Fx.Shape();
            this.shape.graphics.beginLinearGradientFill(
                ["rgba(0,0,0,0)","rgba(255,128,0,1)"], 
                [0, 1], 
                0, 0, 
                0, canvas.height).drawRect(
                    0, 0,
                    canvas.width, canvas.height
                );
            this.stage.addChild(this.shape); 
            this.stage.cache(0, 0,
                    canvas.width, canvas.height);
        }
	};
    env.inherits(FxFillGradient, FxLayer);
    
    FxFillGradient.prototype._drawLayer = function(fxWorld) {                    
        this.stage.update(); 
    };

        
	return FxFillGradient;
});
