/**
 * TODO
 */
define([     
], function(        
)
{
    "use strict";
    var Fade = function(startAlpha, endAlpha) {                
        this.diffAlpha = startAlpha - endAlpha;
        this.endAlpha = endAlpha;
    };        
    
    Fade.prototype = {
        update: function(emitter, p, time) {
           p.mixColor.a  = this.endAlpha + this.diffAlpha * p.energy;
        }    
    };
    
    return Fade;
});