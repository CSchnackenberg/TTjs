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

import * as _ from '@ttjs/lib/lodash'

"use strict";

/**
 * Property parser for unspecific type.
 * This can be used to enforce arbitarry userdata
 */
function AnyPropertyParser() {
}

AnyPropertyParser.prototype = {

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
        //if (_.isEmpty(instanceValue))
        if (typeof instanceValue === undefined)
            return "Must not be empty";

        // as we do not know what is inside the data we have
        // to make a deep copy. The user might change the content
        // in one entity and it should have impact on the
        // definition.
        //
        // I suspect that for simpletypes this is not an issue
        outProps[propertyName] = _.cloneDeep(instanceValue);
    }
};
    
    
//     return AnyPropertyParser;
// });