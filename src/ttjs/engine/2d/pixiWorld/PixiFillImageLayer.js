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
    function PixiFillImageLayer(name, tex) {
        PixiLayer.call(this, name);                
        this.offsetScaleX = 0;
        this.offsetScaleY = 0;
        this.offsetX = 0;
        this.offsetY = 0;
        this.repeat = "none"                
        this.sprites = [];       
        this.image = tex;        
        
        this._stretch = "fitHeight";
        this._scale = {x:1, y:1};
        this._reinit = true;        
    };
    env.inherits(PixiFillImageLayer, PixiLayer);;

    PixiFillImageLayer.prototype.setStretch = function(strMode) {
        this._stretch = strMode;
        this._reinit = true;
    };
    PixiFillImageLayer.prototype._updateSprites = function(pixiWorld, vp) {
        this._reinit = false;         
        switch(this._stretch) {
            default:
            case "none":
                this._scale.x = 1 + this.offsetScaleX;
                this._scale.y = 1 + this.offsetScaleY;
                break;
            case "fill":
                this._scale.x = (vp.w / this.image.width) + this.offsetScaleX;
                this._scale.y = (vp.h / this.image.height) + this.offsetScaleY;                
                break;
             case "fitHeight":                
                if (this.image.height > this.image.width) {                    
                    this._scale.y = (vp.h / this.image.height) + this.offsetScaleY;
                    this._scale.x = ((this.image.height / this.image.width) * this._scale.y) + this.offsetScaleX;
                }
                else {
                    this._scale.y = (vp.h / this.image.height) + this.offsetScaleY;
                    this._scale.x = this._scale.y + this.offsetScaleX;
                }
                break;
        }
        var imgW = Math.floor(this.image.width * this._scale.x);
        var imgH = Math.floor(this.image.height * this._scale.y);
        // remove all existing children
        while(this.layer.children.length > 0) {
            this.layer.removeChild(this.layer.children[0]);
        }
        var numToDrawX = 1;
        var numToDrawY = 1;
        switch(this.repeat) {
            default:
            case "none":            
            case "false":
                numToDrawX = 1;
                numToDrawY = 1;
                break;
            case "both":
            case "repeat-both":
                numToDrawX = Math.ceil(vp.w / imgW) + 1;                
                numToDrawY = Math.ceil(vp.h / imgH) + 1;
                break;
            case "x":
            case "repeat-x":
                var numToDrawX = Math.ceil(vp.w / imgW) + 1;
                break;    
            case "y":
            case "repeat-y":
                var numToDrawY = Math.ceil(vp.h / imgH) + 1;
                break;    
        }        
        this.numSpriteY = numToDrawY;
        this.numSpriteX = numToDrawX;
        for (var y=0; y<numToDrawY; y++)
            for (var x=0; x<numToDrawX; x++) {      
                var spr = new PIXI.Sprite(this.image);
                this.layer.addChild(spr);
            }
    };
    PixiFillImageLayer.prototype._drawNoRepeat = function(pixiWorld, vp, imgW, imgH) {        
        this.layer.children[0].position.x = Math.floor(-vp.x);
        this.layer.children[0].position.y = Math.floor(-vp.y);
        this.layer.children[0].scale.x = imgW / this.image.width;
        this.layer.children[0].scale.y = imgH / this.image.height;
    }
    PixiFillImageLayer.prototype._drawRepeatBoth = function(pixiWorld, vp, imgW, imgH) {        
        var numToDrawX = this.numSpriteX;
        var ox = vp.x - Math.floor(vp.x / imgW)*imgW;
        var numToDrawY = this.numSpriteY;
        var oy = vp.y - Math.floor(vp.y / imgH)*imgH;
        var i = 0;        
        for (var y=0; y<numToDrawY; y++)
            for (var x=0; x<numToDrawX; x++) {      
                this.layer.children[i].position.x = Math.floor(-ox + x*imgW);
                this.layer.children[i].position.y = Math.floor(-oy + y*imgH);
                this.layer.children[i].scale.x = imgW / this.image.width;
                this.layer.children[i].scale.y = imgH / this.image.height;                
                i++;
            }        
    }    
    PixiFillImageLayer.prototype._drawRepeatX = function(pixiWorld, vp, imgW, imgH) {        
        var numToDrawX = Math.ceil(vp.w / imgW) + 1;
        var ox = vp.x - Math.floor(vp.x / imgW)*imgW;        
        //var nd = 0;
        for (var x=0; x<numToDrawX; x++) {      
            this.layer.children[x].position.x = Math.floor(-ox + x*imgW);
            this.layer.children[x].position.y = -vp.y;
            this.layer.children[x].scale.x = imgW / this.image.width;
            this.layer.children[x].scale.y = imgH / this.image.height;                        
        }
    }    
    PixiFillImageLayer.prototype._drawRepeatY = function(pixiWorld, vp, imgW, imgH) {        
        var numToDrawY = Math.ceil(vp.h / imgH) + 1;
        var oy = vp.y - Math.floor(vp.y / imgH)*imgH;
        for (var y=0; y<numToDrawY; y++) {            
            this.layer.children[y].position.x = -vp.x;
            this.layer.children[y].position.y = Math.floor(-oy + y*imgH);
            this.layer.children[y].scale.x = imgW / this.image.width;
            this.layer.children[y].scale.y = imgH / this.image.height;
        }
    }
    PixiFillImageLayer.prototype._update = function(pixiWorld) {
        var vp = this._calcViewport(pixiWorld);
        vp.x += this.offsetX;
        vp.y += this.offsetY;
        if (this._reinit) {      
            this._updateSprites(pixiWorld, vp);
        }
        var imgW = (this.image.width * this._scale.x);
        var imgH = (this.image.height * this._scale.y);
        switch(this.repeat) {
            default:
            case "none":            
            case "false":
                this._drawNoRepeat(pixiWorld, vp, imgW, imgH);       
                break;
            case "both":
            case "repeat-both":
                this._drawRepeatBoth(pixiWorld, vp, imgW, imgH);       
                break;
            case "x":
            case "repeat-x":
                this._drawRepeatX(pixiWorld, vp, imgW, imgH);       
                break;    
            case "y":
            case "repeat-y":
                this._drawRepeatY(pixiWorld, vp, imgW, imgH);       
                break;    
        }        
    };
       
	return PixiFillImageLayer;
});