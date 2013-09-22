/**
 * TODO
 */
define([     
], function(        
)
{
    "use strict";
    var Rotate = function() {                        
    };        
    
    Rotate.prototype = {
        update: function(emitter, p, time) {
            p.rotation += p.rotVelocity * time;
        }    
    };
    
    return Rotate;
});