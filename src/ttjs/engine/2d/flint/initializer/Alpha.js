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
    var Alpha = function(alphaStart, alphaEnd) {        
        this.alphaStart = alphaStart || 0;
        this.alphaEnd = alphaEnd || 1;
    };
    
    Alpha.prototype = {
        init: function(emitter, p)
        {
            p.mixColor.a += (this.alphaEnd - this.alphaStart) *  Math.random() + this.alphaStart;
        }    
    };
    
    return Alpha;
});