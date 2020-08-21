/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2013, Christoph Schnackenberg <bluechs@gmx.de>
 * Copyright (c) 2013, Johannes Brosi <mail@jbrosi.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 */
// define([
//     'ttjs/util/TTTools',
//     'jquery', // TODO !!! replace JQ
// ], function(env, $)
// {
define(["require", "exports", "jquery", "@ttjs/util/TTTools"], function (require, exports, $, TTTools_1) {
    "use strict";
    exports.__esModule = true;
    exports.TextResources = void 0;
    "use strict";
    // TODO remove jquery dependency
    function TextResources() { }
    exports.TextResources = TextResources;
    ;
    TextResources.prototype = {
        getType: function () {
            return "text";
        },
        canHandle: function (url) {
            return (TTTools_1.TTTools.strEndsWith(url.toLowerCase(), ".txt"));
        },
        load: function (url, callback) {
            // TODO !!! replace JQ
            $.ajax({
                url: url,
                dataType: "text"
            }).done(function (data) {
                callback(true, data);
            }).fail(function (xhr, status, error) {
                callback(false, error);
            });
        }
    };
});
// 	return TextResources;
// });
//# sourceMappingURL=TextResources.js.map