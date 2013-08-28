define([
	'ttjs/engine/2d/fxlayer/FxLayer'
], function(
    FxLayer
)
{    
	"use strict";
    
    /**
     * 
     * @param {TileRenderer} A TileRenderer object from 'ttjs/engine/2d/tileRenderer'
     * @returns {FxContext}
     */
    var FxContext = function(tileRenderer, mapRenderModel) {
        this._root = new FxLayer();
        this.tileRenderer = tileRenderer;
        this.mapRenderModel = mapRenderModel;
	};

    FxContext.prototype = {              
        initCanvas: function(canvas, ctx) {
            this.canvas = canvas;
            this.ctx = ctx;
        },
        draw: function() {
            this._root.draw(this);
        },
        getRoot: function() {
            return this._root;
        }
    };
        
	return FxContext;
});
