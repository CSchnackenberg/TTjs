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

"use strict";

import * as _ from '@ttjs/lib/lodash'

/**
 * Property parser for: number, float, real
 */
export function StringPropertyParser() {
}

StringPropertyParser.prototype = {

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
        // we only accept numbers here
        var parsedValue = "" + instanceValue;
        if (!_.isString(parsedValue))
            return "Value is not a String";

        // user validate
        if (propertyInfo.hasOwnProperty("validate"))
        {
            if (!_.isFunction(propertyInfo["validate"]))
                return "Component-Error. 'validate' must be a function!";
            var validationResult = propertyInfo["validate"](parsedValue);
            if (validationResult !== true) {
                if (_.isString(validationResult))
                    return "Validateion failed with message '" + validationResult + "'";
                return "Validateion failed.";
            }
        }

        // add regex - check?
//            if (propertyInfo.hasOwnProperty("match"))
//            {
//                ...
//            }

        outProps[propertyName] = parsedValue;
    }
};
    
    
//     return StringPropertyParser;
// });