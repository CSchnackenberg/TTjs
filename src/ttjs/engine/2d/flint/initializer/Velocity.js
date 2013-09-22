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
    var Velocity = function(startX, endX, startY, endY) {        
        this.startX = startX || 0;
        this.endX = endX || startX;
        this.startY = startY || 0;
        this.endY = endY || startY;
    };
    
    Velocity.prototype = {
        init: function(emitter, p)
        {           
            var xx = (this.endX - this.startX) *  Math.random() + this.startX;
            var yy = (this.endY - this.startY) *  Math.random() + this.startY;
            
            if (p.rotation == 0) {
                p.velocity.x = xx;
                p.velocity.y = yy;
            }
            else {
                var sinv = Math.sin(p.rotation);
                var cosv = Math.cos(p.rotation);					
                p.velocity.x = cosv * xx - sinv * yy;
                p.velocity.y = cosv * yy + sinv * xx;
            }
        }    
    };
    
    return Velocity;
});