/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2013, Christoph Schnackenberg <bluechs@gmx.de>
 * Copyright (c) 2013, Johannes Brosi <mail@jbrosi.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 */
// define(['ttjs/lib/lodash'], function(_) {
define(["require", "exports", "@ttjs/lib/lodash"], function (require, exports, _) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EnumPropertyParser = void 0;
    "use strict";
    /**
     * Property parser for: number, float, real
     */
    function EnumPropertyParser() {
    }
    exports.EnumPropertyParser = EnumPropertyParser;
    EnumPropertyParser.prototype = {
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
            var parsedValue = instanceValue;
            var elements = propertyInfo["allowed"];
            if (!_.isArray(elements))
                return "Error in Component! A list of valid enum-elements is expected.";
            if (!_.contains(elements, parsedValue))
                return 'Cannot find element "' + parsedValue + '" in enum "' + _(elements).toString() + '"';
            outProps[propertyName] = parsedValue;
        }
    };
});
//     return EnumPropertyParser;
// });
//# sourceMappingURL=EnumPropertyParser.js.map