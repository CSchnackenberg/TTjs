/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2020, Christoph Schnackenberg <bluchs@gmx.de>
 * Copyright (c) 2013, Johannes Brosi <mail@jbrosi.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.TTTools = exports.postJson = exports.getJson = exports.getText = void 0;
    /**
     * Loads text via HTTP(S). Uses XMLHttpRequest
     *
     * @param url what to load
     * @param ok optional callback in success case
     * @param failed optional callback in error case
     * @param timeout when it should fail (defaults to 5secs)
     */
    function getText(url, ok, failed, timeout) {
        if (timeout === void 0) { timeout = 5000; }
        var client = new XMLHttpRequest();
        var resultResolved = false;
        client.open('GET', url);
        client.timeout = timeout;
        client.onload = function () {
            if (resultResolved)
                return;
            if (client.status >= 200 && client.status <= 299) {
                if (ok)
                    ok(client.responseText, client.status);
            }
            else {
                if (failed)
                    failed("Error while loading: " + url + ". Status: " + client.status, client.status);
            }
            resultResolved = true;
        };
        client.onerror = function () {
            if (!resultResolved && failed)
                failed("Error while loading: " + url + ". With status: " + client.status, client.status);
            resultResolved = true;
        };
        client.onabort = function () {
            if (!resultResolved && failed)
                failed("Abort while loading: " + url, client.status);
            resultResolved = true;
        };
        client.ontimeout = function () {
            if (!resultResolved && failed)
                failed("Timeout while loading: " + url, client.status);
            resultResolved = true;
        };
        client.send();
    }
    exports.getText = getText;
    /**
     * Loads text via HTTP(S), expects it to be json and converts it to an object. Uses XMLHttpRequest.
     *
     * @param url
     * @param ok
     * @param failed
     * @param timeout
     */
    function getJson(url, ok, failed, timeout) {
        if (timeout === void 0) { timeout = 5000; }
        getText(url, function (jsonStr, hs) {
            var jsonObj = null;
            try {
                jsonObj = JSON.parse(jsonStr);
                if (jsonObj === null || jsonObj === undefined) {
                    failed("Unexpected json from request response. Object is: " + jsonObj, hs);
                    return;
                }
            }
            catch (err) {
                if (failed)
                    failed("Failed to convert request response to json. Error: " + err, 0);
                return;
            }
            if (ok) {
                ok(jsonObj, hs);
                return;
            }
        }, failed, timeout);
    }
    exports.getJson = getJson;
    /**
     * Sends json to the server as POST request and expects text in return
     *
     * @param url
     * @param bodyData
     * @param ok
     * @param failed
     * @param timeout
     */
    function postJson(url, bodyData, ok, failed, timeout) {
        if (timeout === void 0) { timeout = 5000; }
        var client = new XMLHttpRequest();
        var resultResolved = false;
        client.open('POST', url);
        client.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        client.timeout = timeout;
        client.onload = function () {
            if (resultResolved)
                return;
            if (client.status >= 200 && client.status <= 299) {
                if (ok)
                    ok(client.responseText, client.status);
            }
            else {
                if (failed)
                    failed("Error while loading: " + url + ". Status: " + client.status, client.status);
            }
            resultResolved = true;
        };
        client.onerror = function () {
            if (!resultResolved && failed)
                failed("Error while loading: " + url + ". With status: " + client.status, client.status);
            resultResolved = true;
        };
        client.onabort = function () {
            if (!resultResolved && failed)
                failed("Abort while loading: " + url, client.status);
            resultResolved = true;
        };
        client.ontimeout = function () {
            if (!resultResolved && failed)
                failed("Timeout while loading: " + url, client.status);
            resultResolved = true;
        };
        var jsonStr = "";
        try {
            jsonStr = JSON.stringify(bodyData);
        }
        catch (err) {
            setTimeout(function () {
                if (failed) {
                    failed("Cannot convert object to json", 0);
                }
            }, 0);
            return;
        }
        client.send(jsonStr);
    }
    exports.postJson = postJson;
    exports.TTTools = {
        /** @deprecated use TS classes and done */
        inherits: function (ctor, superCtor) {
            ctor.super_ = superCtor;
            ctor.prototype = Object.create(superCtor.prototype, {
                constructor: {
                    value: ctor,
                    enumerable: false,
                    writable: true,
                    configurable: true
                }
            });
        },
        /** @deprecated string can do this now */
        strEndsWith: function (str, suffix) {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        },
        /** @deprecated arrow functions */
        proxy: function (thisArg, callback) {
            return function () {
                callback.call(thisArg, arguments);
            };
        },
        /** @deprecated Array.isArray instead */
        isArray: function (x) {
            return (Object.prototype.toString.call(x) === '[object Array]');
        },
        /** @deprecated TS enums instead */
        checkEnumNoCase: function (value, enumOptions) {
            for (var i = 0; i < enumOptions.length; i++)
                if (("" + value).toLowerCase() === ("" + enumOptions[i]).toLowerCase())
                    return true;
            return false;
        },
        /** @deprecated console.log */
        dumpTree: function (obj, tab) {
            tab = tab || "";
            for (var key in obj) {
                var val = obj[key];
                if (typeof val === "object") {
                    console.log(tab + key + " = {");
                    exports.TTTools.dumpTree(val, tab + "  ");
                    console.log(tab + "}");
                }
                else
                    console.log(tab + key + " = " + val);
            }
        },
        /**
         * Performs a flat combination of two data maps (objects)
         **/
        combineObjects: function (a, b) {
            var ex = {};
            ex = __assign(__assign({}, a), b);
            //$.extend(true, ex, a, b);
            return ex;
        },
        /** internal helper */
        getObjectClass: function (obj) {
            if (obj && obj.constructor && obj.constructor.toString) {
                var arr = obj.constructor.toString().match(/function\s*(\w+)/);
                if (arr && arr.length === 2) {
                    return arr[1];
                }
            }
            return undefined;
        },
        // /**
        //  * @param {Array} scripts to load scripts
        //  * @param {function} ret
        //  **/
        // loadScripts: function(scripts, ret, prefix)
        // {
        //     var result = {};
        //     prefix = "" || prefix;
        //     var loadScripts = scripts.slice();
        //     TTTools._loadScripts(loadScripts.reverse(), ret, prefix, result);
        // },
        //
        // /** @private */
        // _loadScripts: function(scripts, ret, prefix, result)
        // {
        //    if (scripts.length <= 0)
        //    {
        //        ret(result);
        //    }
        //    else
        //    {
        //        var nextSrc = scripts.pop();
        //        $.getScript(prefix + nextSrc + ".js")
        //        .done(function(script, textStatus)
        //        {
        //            result[nextSrc] = "ok";
        //            TTTools._loadScripts(scripts, ret, prefix, result);
        //        })
        //        .fail(function(jqxhr, settings, exception)
        //        {
        //            result[nextSrc] = "err";
        //            TTTools._loadScripts(scripts, ret, prefix, result);
        //        });
        //    }
        // },
        // _loadTextFiles: function(fileList, ret, result)
        // {
        //    if (fileList.length <= 0)
        //    {
        //        ret();
        //    }
        //    else
        //    {
        //         var nextSrc = fileList.pop();
        //         console.log("load: " + nextSrc);
        //         $.ajax(
        //         {
        //             url: nextSrc,
        //             async: true,
        //             dataType: "text",
        //             cache: false
        //         })
        //         .done(function(data, textStatus)
        //         {
        //             result[nextSrc] = data;
        //             TTTools._loadTextFiles(fileList, ret, result);
        //         })
        //         .fail(function(jqxhr, settings, exception)
        //         {
        //             console.error(exception);
        //             result[nextSrc] = null;
        //             result.foundError = true;
        //             TTTools._loadTextFiles(fileList, ret, result);
        //         });
        //    }
        // },
        // loadTextFiles: function(fileList, ret)
        // {
        //     var result = {};
        //     this._loadTextFiles(fileList, function()
        //     {
        //         ret(result);
        //     }, result);
        // },
        enableFullscreen: function (element) {
            if (element.requestFullScreen) {
                element.requestFullScreen();
            }
            else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            }
            else if (element.webkitRequestFullScreen) {
                element.webkitRequestFullScreen();
            }
        },
    };
});
//# sourceMappingURL=TTTools.js.map