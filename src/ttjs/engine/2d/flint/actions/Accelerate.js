/**
 * TODO
 */
define([     
], function(        
)
{
    "use strict";
    var Accelerate = function(x, y) {                
        this.x = x;
        this.y = y;
    };        
    
    Accelerate.prototype = {
        update: function(emitter, p, time) {
            p.velocity.x += time * this.x;
            p.velocity.y += time * this.y;
        }    
    };
    
    return Accelerate;
});