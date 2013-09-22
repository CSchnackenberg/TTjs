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
    var Rotation = function(rotStart, rotEnd) {        
        this.rotStart = rotStart || 0;
        this.rotEnd = rotEnd || 360;
    };
    
    Rotation.prototype = {
        init: function(emitter, p)
        {
            p.rotation += (this.rotEnd - this.rotStart) *  Math.random() + this.rotStart;
        }    
    };
    
    return Rotation;
});