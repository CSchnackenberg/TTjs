/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * SOURCE: http://gent.ilcore.com/2012/06/better-timer-for-javascript.html
 * 
 */
define([    
], function(
)
{    
	"use strict";
    var perfFunction = (function() {
        return performance.now    ||
            (performance as any).mozNow    ||
            (performance as any).msNow     ||
            (performance as any).oNow      ||
            (performance as any).webkitNow ||
            function() {
                return new Date().getTime(); 
            };
    })();
    
    return perfFunction;
});