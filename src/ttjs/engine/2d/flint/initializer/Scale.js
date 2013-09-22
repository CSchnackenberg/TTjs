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
    var Scale = function(rotStart, rotEnd) {        
        this.rotStart = rotStart || 0;
        this.rotEnd = rotEnd || 360;
    };
    
    Scale.prototype = {
        init: function(emitter, p)
        {
            var s = (this.rotEnd - this.rotStart) *  Math.random() + this.rotStart;
            p.scale.x = s;
            p.scale.y = s;
        }    
    };
    
    return Scale;
});