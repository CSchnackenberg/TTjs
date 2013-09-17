define([
    'PIXI'
], function(
    PIXI
)
{    
	"use strict";
    function PixiLayer(name) {
        this._children = [];
        this.name = name || "";
        this.parallax = {x: 1, y: 1};
        this._vp = {
            x: 0,
            y: 0,
            w: 0,
            h: 0
        };        
        this.layer = new PIXI.DisplayObjectContainer();
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
            this.layer.addChild(pixiLayer.layer);
        },
        removeChild: function(pixiLayer) {
            throw new Error("PixiLayer.removeChild: NOT IMPLEMENTED!");
        },
        update: function(pixiWorld) {
            this._update(pixiWorld);            
            var num = this._children.length;            
            for (var i=0; i<num; i++) {
                this._children[i].update(pixiWorld);                
            }
        },
        findByName: function(name) {
            if (name === this.name)
                return this;
            var num = this._children.length;             
            for (var i=0; i<num; i++) {
                var found = this._children[i].findByName(name);
                if (found)
                    return found;
            }
        },        
        /**
         * @private
         * @param {type} pixiWorld
         * @returns {undefined}
         */
        _update: function(pixiWorld) {
            // TODO overwrite
        }
    };
        
	return PixiLayer;
});