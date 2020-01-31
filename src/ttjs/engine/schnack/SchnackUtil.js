/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2020, Christoph Schnackenberg <bluechs@gmx.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 *
 * SchnackScript
 */
define([
], function (
) {

    "use strict";


    const SchnackUtil = {
        /**
         * Does this:
         *
         * splitTrimmed(" a; b; c; d; ", ";")
         *  => ["a", "b", "c", "d"]
         *
         * splitTrimmed(" a; b; c; d; ", ";", true)
         *  => ["a", "b", "c", "d", ""]
         *
         * splitTrimmed(" a; b; c; d; ", ";", true, 2)
         *  => ["a", "b; c; d;"]
         *
         */
        splitTrimmed: function(inn, divider, includeAlways = false, maxParts = -1) {
            let count = 0;
            const res = [];
            while(true) {
                count++;
                if (maxParts > 0 && count >= maxParts) {
                    res.push(inn.trim());
                    break;
                }

                const pos = inn.indexOf(divider);
                if (pos == -1) {
                    if (res.length > 0 || includeAlways) {
                        res.push(inn.trim());
                    }
                    break;
                }
                res.push(inn.substring(0, pos));
                inn = inn.substring(pos + 1);
            }
            return res;
        },
    }


    return SchnackUtil;

});
