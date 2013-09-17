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
    function PixiTileLayer(name, layerData, w, h, tileW, tileH) {
        PixiLayer.call(this, name);           
        this.w = w;
        this.h = h;
        this.tileW = tileW;
        this.tileH = tileH;
        this._scale = {x:1, y:1};
        this._reinit = true;        
    };
    env.inherits(PixiTileLayer, PixiLayer);;

    
    PixiTileLayer.prototype._updateSprites = function(pixiWorld, vp, tileW, tileH) {
        this._reinit = false;         
//        var tileW = Math.floor(this.image.width * this._scale.x);
//        var tileH = Math.floor(this.image.height * this._scale.y);
        // remove all existing children
        while(this.layer.children.length > 0) {
            this.layer.removeChild(this.layer.children[0]);
        }
        var numToDrawX = 1;
        var numToDrawY = 1;
        numToDrawX = Math.ceil(vp.w / tileW) + 1;
        numToDrawY = Math.ceil(vp.h / tileH) + 1;
        this.numSpriteY = numToDrawY;
        this.numSpriteX = numToDrawX;
        for (var y=0; y<numToDrawY; y++)
            for (var x=0; x<numToDrawX; x++) {      
                var spr = new PIXI.TilingSprite(pixiWorld.tiles[1].tex, tileW, tileH);
                this.layer.addChild(spr);
            }
    };
    PixiTileLayer.prototype._updateSpritePos = function(pixiWorld, vp, tileW, tileH) {        
        var numToDrawX = this.numSpriteX;
        var ox = vp.x - Math.floor(vp.x / tileW)*tileW;
        var numToDrawY = this.numSpriteY;
        var oy = vp.y - Math.floor(vp.y / tileH)*tileH;
        var i = 0;        
        for (var y=0; y<numToDrawY; y++)
            for (var x=0; x<numToDrawX; x++) {      
                this.layer.children[i].position.x = Math.floor(-ox + x*tileW);
                this.layer.children[i].position.y = Math.floor(-oy + y*tileH);
                i++;
            }        
    }    
    PixiTileLayer.prototype._update = function(pixiWorld) {
        var vp = this._calcViewport(pixiWorld);
//        vp.x += this.offsetX;
//        vp.y += this.offsetY;
        var tileW = (this.tileW * this._scale.x);
        var tileH = (this.tileH * this._scale.y);
        if (this._reinit) {      
            this._updateSprites(pixiWorld, vp, tileW, tileH);
        }
        this._updateSpritePos(pixiWorld, vp, tileW, tileH);       
    };
       
	return PixiTileLayer;
});