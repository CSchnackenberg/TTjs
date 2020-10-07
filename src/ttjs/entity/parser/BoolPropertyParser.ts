/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2020, Christoph Schnackenberg <bluechs@gmx.de>
 * Copyright (c) 2013, Johannes Brosi <mail@jbrosi.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 */

/**
 * Property parser for: number, float, real
 */
export function BoolPropertyParser()
{
}

BoolPropertyParser.prototype = {

    /**
     *
     * @param {String} propertyName the name
     * @param {Object} propertyInfo data from the component
     * @param {Object} instanceValue unparsed value from the instance
     * @param {Object} outProps object that
     * @return {Mixed} undefined: okay, string: error desc;
     */
    parse: function(propertyName, propertyInfo, instanceValue, outProps) {

        let outValue = propertyInfo.def || false;
        switch(instanceValue) {
            case true: outValue = true; break;
            case false: outValue = false; break;
            case "true": outValue = true; break;
            case "false": outValue = false; break;
            case "1": outValue = true; break;
            case "0": outValue = false; break;
        }

        outProps[propertyName] = outValue;
    }
};
    
