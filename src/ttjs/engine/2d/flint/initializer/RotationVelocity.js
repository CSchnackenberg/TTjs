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
    var RotationVelocity = function(rotStart, rotEnd) {        
        this.rotStart = rotStart || 0;
        this.rotEnd = rotEnd || 360;
    };
    
    RotationVelocity.prototype = {
        init: function(emitter, p)
        {
            p.rotVelocity = (this.rotEnd - this.rotStart) *  Math.random() + this.rotStart;
        }    
    };
    
    return RotationVelocity;
});