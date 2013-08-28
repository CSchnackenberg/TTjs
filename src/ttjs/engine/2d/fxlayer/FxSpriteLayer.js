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
	};
    env.inherits(FxSpriteLayer, FxLayer);;

    FxSpriteLayer.prototype._drawLayer = function(fxContext) {            
        this.stage.update();        
    };        
        
	return FxSpriteLayer;
});
