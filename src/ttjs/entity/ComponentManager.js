/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2013, Christoph Schnackenberg <bluechs@gmx.de>
 * Copyright (c) 2013, Johannes Brosi <mail@jbrosi.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.ComponentManager = void 0;
    exports.ComponentManager = {
        /** maps class-name => class/constructor */
        _classes: {},
        /** maps class-name => [callback1, callback2, ...] */
        _pending: {},
        /** maps class-name => error-string */
        _error: {},
        _pendingChunks: [],
        /** basepath for all components */
        pathPrefix: "",
        /**
         * If a script is loaded how long we wait for the register-component-callback.
         * This is AFTER downloading the file so three seconds should be more than enough.
         **/
        sourceTimeout: 3,
        newInstance: function (cmpClassName) {
            var clz = this._classes[cmpClassName];
            if (clz)
                return new clz();
            return null;
        },
        getClass: function (cmpClassName) {
            var clz = this._classes[cmpClassName];
            if (clz)
                return clz;
            return null;
        },
        getState: function (cmpClassName) {
            if (this._classes[cmpClassName])
                return "ready";
            else if (this._pending[cmpClassName])
                return "pending";
            else if (this._error[cmpClassName])
                return "error";
            else
                return "unknown";
        },
        require: function (src, callback) {
            var _this = this;
            if (!Array.isArray(src))
                src = [src];
            var localPending = [];
            var localReady = [];
            var localNew = {};
            var allReady = true;
            var i, len = src.length;
            for (i = 0; i < len; i++) {
                var source = src[i];
                switch (this.getState(source)) {
                    case "ready":
                        localReady.push(source);
                        break;
                    case "pending":
                        allReady = false;
                        localPending.push(source);
                        break;
                    // not yet loaded
                    case "error":
                        allReady = false;
                        localNew[source] = "err";
                        break;
                    case "unknown":
                        allReady = false;
                        localNew[source] = "unk";
                        break;
                }
            }
            if (allReady) {
                callback(this);
                return;
            }
            var numPending = localPending.length;
            var thiz = this;
            var chunkCallback = function () {
                numPending--;
                //console.log("Pending: ", numPending);
                if (numPending === 0)
                    callback(thiz);
            };
            // create new pendings
            var numNew = 0;
            var scripts = [];
            for (var k in localNew) {
                var val = localNew[k];
                if (val === "err") {
                    console.log("error => pending: ", k);
                    delete this._error[k];
                }
                else {
                    //console.log("new => pending: ", k);
                }
                this._pending[k] = [chunkCallback];
                scripts.push(k);
                numNew++;
            }
            // setup callback
            numPending += numNew;
            // append to pending
            len = localPending.length;
            for (i = 0; i < len; i++) {
                var cb = this._pending[localPending[i]];
                cb.push(chunkCallback);
            }
            var reqList = [];
            scripts.forEach(function (e) { return reqList.push("@" + _this.pathPrefix + e); });
            require(reqList, function () {
                var e_1, _a;
                try {
                    for (var reqList_1 = __values(reqList), reqList_1_1 = reqList_1.next(); !reqList_1_1.done; reqList_1_1 = reqList_1.next()) {
                        var errScriptPath = reqList_1_1.value;
                        var sep = errScriptPath.lastIndexOf('/');
                        var scriptName = sep > -1 ? errScriptPath.substring(sep + 1) : errScriptPath;
                        if (!_this._classes[scriptName]) {
                            console.error("pending => error", scriptName, "Script loaded but no Component registered");
                            var callbacks = _this._pending[scriptName];
                            delete _this._pending[scriptName];
                            _this._error[scriptName] = "Script loaded but no Component registered";
                            for (var i_1 = 0; callbacks && i_1 < callbacks.length; i_1++)
                                callbacks[i_1]();
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (reqList_1_1 && !reqList_1_1.done && (_a = reqList_1["return"])) _a.call(reqList_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }, function (err) {
                console.error(err);
                var failedList = err.requireModules; // this is not reliable!
                // for (let errScriptPath of failedList) {
                for (var i_2 = 0; i_2 < failedList.length; i_2++) {
                    var errScriptPath = failedList[i_2];
                    var sep = errScriptPath.lastIndexOf('/');
                    var scriptName = sep > -1 ? errScriptPath.substring(sep + 1) : errScriptPath;
                    console.error("pending => error", scriptName, "Unable to load script.");
                    var callbacks = _this._pending[scriptName];
                    delete _this._pending[scriptName];
                    _this._error[scriptName] = "Unable to load script.";
                    for (var i_3 = 0; callbacks && i_3 < callbacks.length; i_3++)
                        callbacks[i_3]();
                }
            });
            // start callback
            // var thiz = this;
            // env.loadScripts(scripts, function(result)
            // {
            //     len=scripts.length;
            //     for(i=0; i<len; i++)
            //     {
            //         var scriptName = scripts[i];
            //         if (result[scriptName] === "ok")
            //         {
            //             var callbacks = thiz._pending[scriptName];
            //             if (callbacks)
            //             {
            //                 console.log("pending => pending (script_loaded) ", scriptName);
            //                 if (thiz.sourceTimeout > 0)
            //                     setTimeout(function(scriptName)
            //                 {
            //                     callbacks = thiz._pending[scriptName];
            //                     if (callbacks)
            //                     {
            //                         console.error("pending => error: ", scriptName, ". Register-Component-Timeout!");
            //                         delete thiz._pending[scriptName];;
            //                         thiz._error[scriptName] = "Register-Component-Timeout";
            //                         for (var i2=0; i2<callbacks.length; i2++)
            //                             callbacks[i2]();
            //                     }
            //                 }, 1000*thiz.sourceTimeout, scriptName);
            //
            //
            //                 const xx = require('@game/components/' + scriptName);
            //
            //             }
            //         }
            //         else
            //         {
            //             console.error("pending => error: ", scriptName);
            //             var callbacks = thiz._pending[scriptName];
            //             delete thiz._pending[scriptName];
            //             thiz._error[scriptName] = "Unable to load script.";
            //
            //             for (var i2=0; i2<callbacks.length; i2++)
            //                 callbacks[i2]();
            //         }
            //     }
            // }, this.pathPrefix);
        },
        registerComponentClass: function (className, componentClass) {
            var callbacks = this._pending[className];
            if (!callbacks) {
                console.log("Register Component synced", className);
                this._classes[className] = componentClass;
                //console.error("Unexpected component callback in component \"",className,"\".");
                return;
            }
            //console.log("pending => ready", className);
            delete this._pending[className];
            this._classes[className] = componentClass;
            for (var i2 = 0; i2 < callbacks.length; i2++)
                callbacks[i2]();
        }
    };
});
//# sourceMappingURL=ComponentManager.js.map