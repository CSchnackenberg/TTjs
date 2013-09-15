define([
    'PIXI'
], function(
    PIXI
)
{    
	"use strict";
    function PixiLayer(name, parent) {
        this._children = [];
        this.parent = null;
        this.name = name || "";
        this.parallax = {x: 1, y: 1};
        this._vp = {
            x: 0,
            y: 0,
            w: 0,
            h: 0
        };        
        this.layer = new PIXI.DisplayObjectContainer();
        parent.addChild(this.layer);
    };
	
    PixiLayer.prototype = {      
        _calcViewport: function(fxContext) {
            this._vp.x = fxContext.viewport.x * this.parallax.x;
            this._vp.y = fxContext.viewport.y * this.parallax.y;
            this._vp.w = fxContext.viewport.w;
            this._vp.h = fxContext.viewport.h;
            return this._vp;
        },
        getNumChildren: function() {
            return this._children.lenght;
        },
        addChild: function(pixiLayer) {
            this._children.push(pixiLayer);
            pixiLayer.parent = this;
        },
        removeChild: function(pixiLayer) {
            console.error("FxLayer.removeChild: NOT IMPLEMENTED!");
        },
        _update: function(pixiWorld) {
            
        },
    };
        
	return PixiLayer;
});