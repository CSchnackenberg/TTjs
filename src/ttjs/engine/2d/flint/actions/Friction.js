/**
 * TODO
 */
define([     
], function(        
)
{
    "use strict";
    var Friction = function(friction) {                        
        this.friction = friction;
    };        
    
    Friction.prototype = {
        update: function(emitter, p, time) {
            var len2 = p.velocity.x  * p.velocity.x + p.velocity.y  * p.velocity.y;
            if( len2 == 0 )
            {
                return;
            }
            var scale = 1 - (this.friction * time ) / ( sqrt( len2 ) * p.mass );
            if( scale < 0 )
            {
                p.velocity.x = 0
                p.velocity.y = 0
            }
            else
            {
                p.velocity.x = p.velocity.x * scale;
                p.velocity.y = p.velocity.y * scale;                
            }
        }    
    };
    
    return Friction;
});