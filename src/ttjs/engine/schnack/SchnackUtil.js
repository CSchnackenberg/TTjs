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
// define([
// ], function (
// ) {
define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.SchnackUtil = void 0;
    exports.SchnackUtil = {
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
        splitTrimmed: function (inn, divider, includeAlways, maxParts) {
            if (includeAlways === void 0) { includeAlways = false; }
            if (maxParts === void 0) { maxParts = -1; }
            var count = 0;
            var res = [];
            while (true) {
                count++;
                if (maxParts > 0 && count >= maxParts) {
                    res.push(inn.trim());
                    break;
                }
                var pos = inn.indexOf(divider);
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
    };
});
//     return SchnackUtil;
//
// });
//# sourceMappingURL=SchnackUtil.js.map