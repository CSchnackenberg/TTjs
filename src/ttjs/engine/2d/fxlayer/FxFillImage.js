/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2013, Christoph Schnackenberg <bluechs@gmx.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 */
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
    var FxFillImage = function(img) {        
        FxLayer.call(this); // < super()        
        this.image = img;
        this.stretch = null;
	};
    env.inherits(FxFillImage, FxLayer);;
    
    FxFillImage.prototype.setImage = function(img) {        
        this.image = img;        
    };

    FxFillImage.prototype._drawLayer = function(fxContext) {                    
        if (!this.image)
            return;
        if (this.stretch) {            
            if (!this._coords)
                this._calcCoords(fxContext);            
            fxContext.ctx.drawImage(this.image,
                this._coords.dx, this._coords.dy,
                this._coords.dw, this._coords.dh
            );
        }            
        else
            fxContext.ctx.drawImage(this.image, 0, 0);
    };
    
    FxFillImage.prototype._calcCoords = function(fxContext) {        
        switch(this.stretch) {
            default:
            case "original":
                this._coords = {
                    dx: 0,
                    dy: 0,
                    dw: this.image.width,
                    dh: this.image.height,
                };
                break;
            case "fill":
                this._coords = {
                    dx: 0,
                    dy: 0,
                    dw: fxContext.canvas.width,
                    dh: fxContext.canvas.height,
                };
                break;
             case "fitHeight":
                this._coords = {
                    dx: 0,
                    dy: 0,
                    dw: fxContext.canvas.width,
                    dh: fxContext.canvas.height,
                };
                break;
        }
    }
        
	return FxFillImage;
});
