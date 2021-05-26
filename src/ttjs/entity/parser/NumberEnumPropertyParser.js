/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2020, Christoph Schnackenberg <bluechs@gmx.de>
 * Copyright (c) 2013, Johannes Brosi <mail@jbrosi.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 */
define(["require", "exports", "@ttjs/lib/lodash"], function (require, exports, _) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NumberEnumPropertyParser = void 0;
    /**
     * Property parser for: number, float, real
     */
    function NumberEnumPropertyParser() {
    }
    exports.NumberEnumPropertyParser = NumberEnumPropertyParser;
    NumberEnumPropertyParser.prototype = {
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
            const parsedValue = Number(instanceValue);
            if (_.isNaN(parsedValue))
                return "Value is not a number";
            const elements = propertyInfo["allowed"];
            if (!_.isArray(elements))
                return "Error in Component! A list of valid number-enum-elements is expected.";
            let bad = true;
            for (let i = 0; i < elements.length; i++) {
                const enumNum = Number(elements[i]);
                if (_.isNaN(enumNum))
                    return "Error in Component! Enum number allowed-enties must be of number or number compatible.";
                if (enumNum == parsedValue) {
                    bad = false;
                    break;
                }
            }
            if (bad) // who's bad
                return 'Cannot find element "' + parsedValue + '" in enum "' + _(elements).toString() + '"';
            outProps[propertyName] = parsedValue;
        }
    };
});
//# sourceMappingURL=NumberEnumPropertyParser.js.map