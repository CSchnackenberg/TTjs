/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2019, Christoph Schnackenberg <bluechs@gmx.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 */
define([
    'ttjs/lib/lodash',
    'ttjs/engine/2d/flint/Easing',
], function(
    _,
    Easing
) {
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


    EaseFuncPropertyParser.prototype = {
                
        /**
         * 
         * @param {String} propertyName the name
         * @param {Object} propertyInfo data from the component
         * @param {Object} instanceValue unparsed value from the instance
         * @param {Object} outProps object that 
         * @return {Mixed} undefined: okay, string: error desc;
         */
        parse: function(propertyName, propertyInfo, instanceValue, outProps)
        {

            let easeName = "";
            let easeMode = "inout";


            // We accept string like this: Sine.in
            if (_.isString(instanceValue)) {
                const splitPos = instanceValue.indexOf(".");
                if (splitPos == -1) { // no '.'
                    easeName = instanceValue;
                }
                else {
                    const parts = instanceValue.split(".");
                    easeName = parts[0];
                    easeMode = parts[1];
                }
            }
            // we also accept an array with two values ["sine", "in"]
            else if (_.isArray(instanceValue) && instanceValue.length == 2) {
                easeName = instanceValue[0];
                easeMode = instanceValue[1];
            }
            else {
                return "Unknown type for ease-func. Provide a string or an array with two values.";
            }


            // to avoid (very slow) toLowerCase we simply do some
            // switching here.

            let easeType = null;
            switch(easeName) {
                case "back": case "Back": easeType = Easing.Back; break;
                case "bounce": case "Bounce": easeType = Easing.Bounce; break;
                case "circular": case "Circular": easeType = Easing.Circular; break;
                case "cubic": case "Cubic": easeType = Easing.Cubic; break;
                case "elastic": case "Elastic": easeType = Easing.Elastic; break;
                case "exponential": case "Exponential": easeType = Easing.Exponential; break;
                case "linear": case "Linear": easeType = Easing.Linear; break;
                case "quadratic": case "Quadratic": easeType = Easing.Quadratic; break;
                case "quartic": case "Quartic": easeType = Easing.Quartic; break;
                case "quintic": case "Quintic": easeType = Easing.Quintic; break;
                case "sine": case "Sine": easeType = Easing.Sine; break;
            }
            if (!easeType)
                return "Unknown ease type: '" + easeName + "'";

            let finalFunc = null;
            switch(easeMode) {
                case "in": case "In": case "easeIn": case "EaseIn":
                    finalFunc = easeType["easeIn"];
                    break;
                case "out": case "Out": case "easeOut": case "EaseOut":
                    finalFunc = easeType["easeOut"];
                    break;
                case "inout": case "inOut": case "easeInOut": case "EaseInOut":
                    finalFunc = easeType["easeInOut"];
                    break;
            }

            if (!easeType)
                return "For ease type: '" + easeName + "' unknown func: '" + easeMode + "'";

            outProps[propertyName] = finalFunc;
        }        
    };
    
    
    return EaseFuncPropertyParser;
});