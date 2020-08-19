/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * SOURCE: http://gent.ilcore.com/2012/06/better-timer-for-javascript.html
 * 
 */

export function getPerformanceNow():()=>number {
    return performance.now    ||
    (performance as any).mozNow    ||
    (performance as any).msNow     ||
    (performance as any).oNow      ||
    (performance as any).webkitNow ||
    function() {
        return new Date().getTime();
    };
}

export function getRequestAnimationFrame2(): (callback: FrameRequestCallback)=>number {
    return window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        (window as any).mozRequestAnimationFrame    ||
        (window as any).oRequestAnimationFrame      ||
        (window as any).msRequestAnimationFrame     ||
        function( callback:(t:number) => void ) {
            window.setTimeout(callback, 1000 / 60);
            return 0;
        };
}