/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2019, Christoph Schnackenberg <bluechs@gmx.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 */
// define([
//     'ttjs/lib/lodash',
//     'ttjs/engine/2d/flint/Easing',
// ], function(
//     _,
//     Easing
// ) {
define(["require", "exports", "@ttjs/lib/lodash", "@ttjs/engine/2d/flint/Easing"], function (require, exports, _, Easing_1) {
    "use strict";
    exports.__esModule = true;
    exports.EaseFuncPropertyParser = void 0;
    "use strict";
    /**
     * Translates a string to a ease function.
     * This function allows a great deal of
     *
     * Examples:
     *
     * sine.out => Easing.Sine.easeOut
     * sine.in => Easing.Sine.easeIn
     * sine.inOut => Easing.Sine.easeInOut
     * sine => Easing.Sine.easeInOut
     *
     * ["sine", "out"] => Easing.Sine.easeOut
     *
     */
    function EaseFuncPropertyParser() {
    }
    exports.EaseFuncPropertyParser = EaseFuncPropertyParser;
    EaseFuncPropertyParser._issue = null;
    /**
     * This function does the actual transform.
     *
     * It returns the matching ease function. If null is returned check for EaseFuncPropertyParser._issue to determine
     * the reason.
     *
     * @static
     */
    EaseFuncPropertyParser.toEaseFunc = function (easeFuncDef) {
        EaseFuncPropertyParser._issue = null;
        var easeName = "";
        var easeMode = "inout";
        // We accept string like this: Sine.in
        if (_.isString(easeFuncDef)) {
            var splitPos = easeFuncDef.indexOf(".");
            if (splitPos == -1) { // no '.'
                easeName = easeFuncDef;
            }
            else {
                var parts = easeFuncDef.split(".");
                easeName = parts[0];
                easeMode = parts[1];
            }
        }
        // we also accept an array with two values ["sine", "in"]
        else if (_.isArray(easeFuncDef) && easeFuncDef.length == 2) {
            easeName = easeFuncDef[0];
            easeMode = easeFuncDef[1];
        }
        else {
            EaseFuncPropertyParser._issue = "Unknown type for ease-func. Provide a string or an array with two values.";
            return null;
        }
        // to avoid (very slow) toLowerCase we simply do some
        // switching here.
        var easeType = null;
        switch (easeName) {
            case "back":
            case "Back":
                easeType = Easing_1.Easing.Back;
                break;
            case "bounce":
            case "Bounce":
                easeType = Easing_1.Easing.Bounce;
                break;
            case "circular":
            case "Circular":
                easeType = Easing_1.Easing.Circular;
                break;
            case "cubic":
            case "Cubic":
                easeType = Easing_1.Easing.Cubic;
                break;
            case "elastic":
            case "Elastic":
                easeType = Easing_1.Easing.Elastic;
                break;
            case "exponential":
            case "Exponential":
                easeType = Easing_1.Easing.Exponential;
                break;
            case "linear":
            case "Linear":
                easeType = Easing_1.Easing.Linear;
                break;
            case "quadratic":
            case "Quadratic":
                easeType = Easing_1.Easing.Quadratic;
                break;
            case "quartic":
            case "Quartic":
                easeType = Easing_1.Easing.Quartic;
                break;
            case "quintic":
            case "Quintic":
                easeType = Easing_1.Easing.Quintic;
                break;
            case "sine":
            case "Sine":
                easeType = Easing_1.Easing.Sine;
                break;
        }
        if (!easeType) {
            EaseFuncPropertyParser._issue = "Unknown ease type: '" + easeName + "'";
            return null;
        }
        var finalFunc = null;
        switch (easeMode) {
            case "in":
            case "In":
            case "easeIn":
            case "EaseIn":
                finalFunc = easeType["easeIn"];
                break;
            case "out":
            case "Out":
            case "easeOut":
            case "EaseOut":
                finalFunc = easeType["easeOut"];
                break;
            case "inout":
            case "inOut":
            case "easeInOut":
            case "EaseInOut":
                finalFunc = easeType["easeInOut"];
                break;
        }
        if (!easeType) {
            EaseFuncPropertyParser._issue = "For ease type: '" + easeName + "' unknown func: '" + easeMode + "'";
            return null;
        }
        return finalFunc;
    };
    EaseFuncPropertyParser.prototype = {
        /**
         *
         * @param {String} propertyName the name
         * @param {Object} propertyInfo data from the component
         * @param {Object} instanceValue unparsed value from the instance
         * @param {Object} outProps object that
         * @return {Mixed} undefined: okay, string: error desc;
         */
        parse: function (propertyName, propertyInfo, instanceValue, outProps) {
            var finalFunc = EaseFuncPropertyParser.toEaseFunc(instanceValue);
            if (finalFunc == null) {
                return EaseFuncPropertyParser._issue;
            }
            outProps[propertyName] = finalFunc;
        }
    };
});
//     return EaseFuncPropertyParser;
// });
//# sourceMappingURL=EaseFuncPropertyParser.js.map