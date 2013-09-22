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
    var Position = function(pos) {        
        var pos = pos || {x: 0, y: 0};
        this.pos = {
            x: pos.x || 0,
            y: pos.y || 0
        };
    };
    
    Position.prototype = {
        init: function(emitter, p)
        {
            p.position.x += this.pos.x;
            p.position.y += this.pos.y;
        }    
    };
    
    return Position;
});