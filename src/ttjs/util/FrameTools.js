/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * SOURCE: http://gent.ilcore.com/2012/06/better-timer-for-javascript.html
 *
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.getRequestAnimationFrame2 = exports.getPerformanceNow = void 0;
    function getPerformanceNow() {
        return performance.now ||
            performance.mozNow ||
            performance.msNow ||
            performance.oNow ||
            performance.webkitNow ||
            function () {
                return new Date().getTime();
            };
    }
    exports.getPerformanceNow = getPerformanceNow;
    function getRequestAnimationFrame2() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
                return 0;
            };
    }
    exports.getRequestAnimationFrame2 = getRequestAnimationFrame2;
});
//# sourceMappingURL=FrameTools.js.map