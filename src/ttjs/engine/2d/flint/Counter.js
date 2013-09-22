/**
 * TODO
 */
define([    
], function(
)
{    
	"use strict";
    function Counter() {
        this.started = true;
    };
    var p = Counter.prototype;
	     
    p.startEmitter = function(emitter) {
        return 0; // overwrite
    };
    p.spawnParticles = function(emitter, time) {
        return 0; // overwrite
    };
    p.isCompleted = function() {
        return false; // overwrite
    };
    
    return Counter;
});