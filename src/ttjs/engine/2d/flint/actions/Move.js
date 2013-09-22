/**
 * TODO
 */
define([     
], function(        
)
{
    "use strict";
    var Move = function() {                
    };        
    
    Move.prototype = {
        update: function(emitter, p, time) {
            p.lastPosition.x = p.position.x;
            p.lastPosition.y = p.position.y;

            p.position.x += p.velocity.x * time;
            p.position.y += p.velocity.y * time;
        }    
    };
    
    return Move;
});