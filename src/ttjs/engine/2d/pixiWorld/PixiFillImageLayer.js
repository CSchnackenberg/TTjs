define([
    'PIXI',
    'ttjs/engine/2d/pixiWorld/PixiLayer',
    'env'
], function(
    PIXI,
    PixiLayer,
    env
)
{    
	"use strict";
    function PixiFillImageLayer(name) {
        PixiLayer.call(this);
        this.name = name || "";
        this.parallax = {x: 1, y: 1};
        this._vp = {
            x: 0,
            y: 0,
            w: 0,
            h: 0
        };        
        this.layer = new PIXI.DisplayObjectContainer();
        //parent.addChild(this.layer);
    };
    env.inherits(PixiFillImageLayer, PixiLayer);;
	
    
        
	return PixiFillImageLayer;
});