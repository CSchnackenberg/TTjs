/**
 * TODO
 */
define([     
], function(        
)
{
    "use strict";
    var TargetScale = function(targetScale, rate) {  
        this.targetScale = targetScale || 1;
        this.rate= rate || 0.1;
    };        
    
    TargetScale.prototype = {
        update: function(emitter, p, time) {
            p.scale.x += (this.targetScale - p.scale.x ) * this.rate * time;
            p.scale.y += (this.targetScale - p.scale.y ) * this.rate * time;
        }    
    };
    
    return TargetScale;
});