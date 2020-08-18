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
define(['ttjs/util/TTTools'], function (env) {
    "use strict";
    function ImageResources() { }
    ;
    ImageResources.prototype = {
        getType: function () {
            return "jsImage";
        },
        canHandle: function (url) {
            return (env.strEndsWith(url.toLowerCase(), ".png") ||
                env.strEndsWith(url.toLowerCase(), ".jpg") ||
                env.strEndsWith(url.toLowerCase(), ".jpeg") ||
                env.strEndsWith(url.toLowerCase(), ".gif"));
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
    return ImageResources;
});
//# sourceMappingURL=ImageResources.js.map