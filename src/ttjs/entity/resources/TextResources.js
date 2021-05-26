define(["require", "exports", "@ttjs/util/TTTools"], function (require, exports, TTTools_1) {
    "use strict";
    exports.__esModule = true;
    exports.TextResources = void 0;
    function TextResources() { }
    exports.TextResources = TextResources;
    ;
    TextResources.prototype = {
        getType: function () {
            return "text";
        },
        canHandle: function (url) {
            return url.toLowerCase().endsWith(".txt"); //(env.strEndsWith(url.toLowerCase(), ".txt"));
        },
        load: function (url, callback) {
            // $.ajax({
            //     url: url,
            //     dataType: "text"
            // }).done(function ( data ) {
            //     callback(true, data);
            // }).fail(function (xhr, status, error){
            //     callback(false, error);
            // });
            TTTools_1.getText(url, function (data) { return callback(true, data); }, function (error) { return callback(false, error); });
        }
    };
});
//# sourceMappingURL=TextResources.js.map