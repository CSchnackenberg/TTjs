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
    'ttjs/engine/2d/fxlayer/FxLayer'
], function(
    env,
    FxLayer
)
{    
	"use strict";
    var FxFillImage = function(img) {        
        FxLayer.call(this); // < super()        
        this.image = img;
        this.repeat = "both";
        this.scaleX = 0;
        this.scaleY = 0;
        this.offsetX = 0;
        this.offsetY = 0;
                
        this._scale = {x: 1, y: 1}
        this._stretch = null;        
        this._newStretch = "none"
	};
    env.inherits(FxFillImage, FxLayer);;
    
    FxFillImage.prototype.setImage = function(img) {        
        this.image = img;        
    };

    FxFillImage.prototype.setStretch = function(strMode) {
        this._stretch = null;
        this._newStretch = strMode;
    };

    FxFillImage.prototype._drawLayer = function(fxWorld) {                    
        if (!this.image)
            return;
        
        var vp = this._calcViewport(fxWorld);
        vp.x += this.offsetX;
        vp.y += this.offsetY;
        
        // scale to match size
        if (!this._stretch) {      
            this._stretch = this._newStretch;
            switch(this._newStretch) {
            default:
            case "none":
                this._scale.x = 1 + this.scaleX;
                this._scale.y = 1 + this.scaleY;
                this._stretch = "none";
                break;
            case "fill":
                this._scale.x = (vp.w / this.image.width) + this.scaleX;
                this._scale.y = (vp.h / this.image.height) + this.scaleY;                
                break;
             case "fitHeight":                
                if (this.image.height > this.image.width) {                    
                    this._scale.y = (vp.h / this.image.height) + this.scaleY;
                    this._scale.x = ((this.image.height / this.image.width) * this._scale.y) + this.scaleX;
                }                    
                else {                    
                    this._scale.y = (vp.h / this.image.height) + this.scaleY;
                    this._scale.x = this._scale.y + this.scaleX;
                }
                break;
            }
        }
        var imgW = Math.floor(this.image.width * this._scale.x);
        var imgH = Math.floor(this.image.height * this._scale.y); 
        
        
        if (this.alpha && this.alpha < 1) {            
            fxWorld.ctx.globalAlpha = this.alpha;
        }
        
        if (this.composite) {
            fxWorld.ctx.globalCompositeOperation = this.composite;
        }            
        
        switch(this.repeat) {
            default:
            case "none":            
            case "false":
                this._drawNoRepeat(fxWorld, vp, imgW, imgH);       
                break;
            case "both":
            case "repeat-both":
                this._drawRepeatBoth(fxWorld, vp, imgW, imgH);       
                break;
            case "x":
            case "repeat-x":
                this._drawRepeatX(fxWorld, vp, imgW, imgH);       
                break;    
            case "y":
            case "repeat-y":
                this._drawRepeatY(fxWorld, vp, imgW, imgH);       
                break;    
        }
        if (this.alpha && this.alpha < 1) {
            fxWorld.ctx.globalAlpha = 1;                       
        }
        if (this.composite) {
            fxWorld.ctx.globalCompositeOperation = "source-over";
        }            
    };
    
    FxFillImage.prototype._drawNoRepeat = function(fxWorld, vp, imgW, imgH) {        
        fxWorld.ctx.drawImage(this.image, 
            Math.floor(-vp.x), 
            Math.floor(-vp.y),
            imgW, imgH);
    }
    
    FxFillImage.prototype._drawRepeatBoth = function(fxWorld, vp, imgW, imgH) {        
        var numToDrawX = Math.ceil(vp.w / imgW) + 1;
        var ox = vp.x - Math.floor(vp.x / imgW)*imgW;
        var numToDrawY = Math.ceil(vp.h / imgH) + 1;
        var oy = vp.y - Math.floor(vp.y / imgH)*imgH;
        var nd = 0;
        for (var y=0; y<numToDrawY; y++)
            for (var x=0; x<numToDrawX; x++) {      
                fxWorld.ctx.drawImage(this.image, 
                    Math.floor(-ox + x*imgW), 
                    Math.floor(-oy + y*imgH),
                    imgW, imgH);
                nd++;
            }
    }
    
    FxFillImage.prototype._drawRepeatX = function(fxWorld, vp, imgW, imgH) {        
        var numToDrawX = Math.ceil(vp.w / imgW) + 1;
        var ox = vp.x - Math.floor(vp.x / imgW)*imgW;        
        var nd = 0;
        for (var x=0; x<numToDrawX; x++) {      
            fxWorld.ctx.drawImage(this.image, 
                Math.floor(-ox + x*imgW), 
                -vp.y,
                imgW, imgH);
            nd++;
        }
    }
    
    FxFillImage.prototype._drawRepeatY = function(fxWorld, vp, imgW, imgH) {        
        var numToDrawY = Math.ceil(vp.h / imgH) + 1;
        var oy = vp.y - Math.floor(vp.y / imgH)*imgH;
        var nd = 0;
        for (var y=0; y<numToDrawY; y++) {            
            fxWorld.ctx.drawImage(this.image, 
                -vp.x, 
                Math.floor(-oy + y*imgH),
                imgW, imgH);
            nd++;
        }
    }
        
	return FxFillImage;
});
