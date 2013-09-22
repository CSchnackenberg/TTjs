/**
 * TODO
 */
define([     
], function(        
)
{
    "use strict";
    var RandomDrift = function(x, y) {                
        this.x = x;
        this.y = y;
    };        
    
    RandomDrift.prototype = {
        update: function(emitter, p, time) {
            p.velocity.x += (Math.random() - 0.5) * this.x + time;
            p.velocity.y += (Math.random() - 0.5) * this.y + time;
        }    
    };
    
    return RandomDrift;
});