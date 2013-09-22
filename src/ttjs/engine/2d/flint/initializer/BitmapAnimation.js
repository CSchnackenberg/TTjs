/**
 * TODO
 */
define([   
    'ttjs/lib/easeljs-0.6.0.min'
], function(
    Fx
)
{    
    "use strict";
    var BitmapAnimation = function(spriteSheet, frameRangeStart, frameRangeEnd) {        
        this.s = frameRangeStart;
        this.e = frameRangeEnd || frameRangeStart;
        this.sheet = spriteSheet;
    };
    
    BitmapAnimation.prototype = {
        init: function(emitter, p)
        {
            var frameNmb = this.s + Math.random() * (this.e - this.s);
            p.sprite = new Fx.BitmapAnimation(this.sheet); 
            p.sprite.gotoAndPlay(frameNmb);
            
        }    
    };
    
    return BitmapAnimation;
});