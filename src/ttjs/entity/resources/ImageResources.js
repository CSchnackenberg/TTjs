/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2013, Christoph Schnackenberg <bluechs@gmx.de>
 * Copyright (c) 2013, Johannes Brosi <mail@jbrosi.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 */
// define(['ttjs/util/TTTools'], function(env)
// {
define(["require", "exports", "@ttjs/util/TTTools"], function (require, exports, TTTools_1) {
    "use strict";
    exports.__esModule = true;
    exports.ImageResources = void 0;
    "use strict";
    function ImageResources() { }
    exports.ImageResources = ImageResources;
    ;
    ImageResources.prototype = {
        getType: function () {
            return "jsImage";
        },
        canHandle: function (url) {
            return (TTTools_1.TTTools.strEndsWith(url.toLowerCase(), ".png") ||
                TTTools_1.TTTools.strEndsWith(url.toLowerCase(), ".jpg") ||
                TTTools_1.TTTools.strEndsWith(url.toLowerCase(), ".jpeg") ||
                TTTools_1.TTTools.strEndsWith(url.toLowerCase(), ".gif"));
        },
        load: function (url, callback) {
            var jsImage = new Image();
            jsImage.onload = function () {
                callback(true, jsImage);
            };
            var errorHandler = function () {
                callback(false, "Unable to load image '" + url + "'");
            };
            jsImage.onerror = errorHandler;
            jsImage.onabort = errorHandler;
            jsImage.src = url;
        }
    };
});
// 	return ImageResources;
// });
//# sourceMappingURL=ImageResources.js.map