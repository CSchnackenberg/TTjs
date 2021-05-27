define(["require", "exports", "@ttjs/util/TTTools"], function (require, exports, TTTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ImageResources = void 0;
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
//# sourceMappingURL=ImageResources.js.map