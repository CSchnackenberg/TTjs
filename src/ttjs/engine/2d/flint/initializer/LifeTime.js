/**
 * TODO
 */
define([   
], function(
)
{    
    "use strict";
    var LifeTime = function(rangeStart, rangeEnd) {        
        this.s = rangeStart;
        this.e = rangeEnd || rangeStart;
    };
    
    LifeTime.prototype = {
        init: function(emitter, p)
        {
            p.lifetime = this.s + Math.random() * (this.e - this.s);
        }    
    };
    
    return LifeTime;
});