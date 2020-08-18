"use strict";
/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2013, Christoph Schnackenberg <bluechs@gmx.de>
 * Copyright (c) 2013, Johannes Brosi <mail@jbrosi.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 */
define(['ttjs/lib/lodash'], function (_) {
    "use strict";
    /**
     * Property parser for: number, float, real
     */
    function NumberPropertyParser() {
    }
    NumberPropertyParser.prototype = {
        /**
         *
         * @param {String} propertyName the name
         * @param {Object} propertyInfo data from the component
         * @param {Object} instanceValue unparsed value from the instance
         * @param {Object} outProps object that
         * @return {Mixed} undefined: okay, string: error desc;
         */
        parse: function (propertyName, propertyInfo, instanceValue, outProps) {
            // we only accept numbers here
            var parsedValue = Number(instanceValue);
            if (_.isNaN(parsedValue))
                return "Value is not a number";
            // check minvalue
            if (propertyInfo.hasOwnProperty("min")) {
                var min = Number(propertyInfo["min"]);
                if (_.isNaN(min))
                    return "Component-Error. Min must be a number!";
                if (parsedValue < min)
                    return "Required value is to small. Minimum is " + min + ". Provided: \"" + parsedValue + "\"";
            }
            // check maxvalue
            if (propertyInfo.hasOwnProperty("max")) {
                var max = Number(propertyInfo["max"]);
                if (_.isNaN(max))
                    return "Component-Error. Max must be a number!";
                if (parsedValue > max)
                    return "Required value is to big. Maximum is " + max + ". Provided: \"" + parsedValue + "\"";
            }
            // user validate
            if (propertyInfo.hasOwnProperty("validate")) {
                if (!_.isFunction(propertyInfo["validate"]))
                    return "Component-Error. 'validate' must be a function!";
                var validationResult = propertyInfo["validate"](parsedValue);
                if (validationResult !== true) {
                    if (_.isString(validationResult))
                        return "Validateion failed with message '" + validationResult + "'";
                    return "Validateion failed.";
                }
            }
            outProps[propertyName] = parsedValue;
        }
    };
    return NumberPropertyParser;
});
//# sourceMappingURL=NumberPropertyParser.js.map