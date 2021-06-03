/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2020, Christoph Schnackenberg <bluchs@gmx.de>
 * Copyright (c) 2013, Johannes Brosi <mail@jbrosi.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 */

/**
 * Loads text via HTTP(S). Uses XMLHttpRequest
 *
 * @param url what to load
 * @param ok optional callback in success case
 * @param failed optional callback in error case
 * @param timeout when it should fail (defaults to 5secs)
 */
export function getText(
    url:string,
    ok?:(txt:string, httpStatus?:number)=>void,
    failed?:(errInfo:string, httpStatus?:number)=>void,
    timeout:number=5000
) {
    const client = new XMLHttpRequest();
    let resultResolved = false;

    client.open('GET', url);
    client.timeout = timeout;
    client.onload = function() {
        if (resultResolved)
            return;
        if (client.status >= 200 && client.status <= 299) {
            if (ok)
                ok(client.responseText, client.status);
        }
        else {
            if (failed)
                failed(`Error while loading: ${url}. Status: ${client.status}`, client.status);
        }
        resultResolved = true;
    };

    client.onerror = function() {
        if (!resultResolved && failed)
            failed(`Error while loading: ${url}. With status: ${client.status}`, client.status);
        resultResolved = true;
    };

    client.onabort = function() {
        if (!resultResolved && failed)
            failed(`Abort while loading: ${url}`, client.status);
        resultResolved = true;
    };

    client.ontimeout = function() {
        if (!resultResolved && failed)
            failed(`Timeout while loading: ${url}`, client.status);
        resultResolved = true;
    };
    client.send();
}

/**
 * Loads text via HTTP(S), expects it to be json and converts it to an object. Uses XMLHttpRequest.
 *
 * @param url
 * @param ok
 * @param failed
 * @param timeout
 */
export function getJson(
    url:string,
    ok?:(json:any, httpStatus?:number)=>void,
    failed?:(errInfo:string, httpStatus?:number)=>void,
    timeout:number=5000
) {
    getText(url, (jsonStr, hs) => {
        let jsonObj = null;
        try {
            jsonObj = JSON.parse(jsonStr);
            if (jsonObj === null || jsonObj === undefined) {
                failed(`Unexpected json from request response. Object is: ${jsonObj}`, hs);
                return;
            }
        }
        catch(err) {
            if (failed)
                failed(`Failed to convert request response to json. Error: ${err}`, 0);
            return;
        }

        if (ok) {
            ok(jsonObj, hs);
            return;
        }
    }, failed, timeout);
}


/**
 * Sends json to the server as POST request and expects text in return
 *
 * @param url
 * @param bodyData
 * @param ok
 * @param failed
 * @param timeout
 */
export function postJson(
    url:string,
    bodyData:object,
    ok?:(txt:string, httpStatus?:number)=>void,
    failed?:(errInfo:string, httpStatus?:number)=>void,
    timeout:number=5000
) {
    const client = new XMLHttpRequest();
    let resultResolved = false;

    client.open('POST', url);
    client.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    client.timeout = timeout;
    client.onload = function() {
        if (resultResolved)
            return;
        if (client.status >= 200 && client.status <= 299) {
            if (ok)
                ok(client.responseText, client.status);
        }
        else {
            if (failed)
                failed(`Error while loading: ${url}. Status: ${client.status}`, client.status);
        }
        resultResolved = true;
    };

    client.onerror = function() {
        if (!resultResolved && failed)
            failed(`Error while loading: ${url}. With status: ${client.status}`, client.status);
        resultResolved = true;
    };

    client.onabort = function() {
        if (!resultResolved && failed)
            failed(`Abort while loading: ${url}`, client.status);
        resultResolved = true;
    };

    client.ontimeout = function() {
        if (!resultResolved && failed)
            failed(`Timeout while loading: ${url}`, client.status);
        resultResolved = true;
    };

    let jsonStr = "";
    try {
        jsonStr = JSON.stringify(bodyData);
    }
    catch(err) {
        setTimeout(() => {
            if (failed) {
                failed(`Cannot convert object to json`, 0);
            }
        }, 0);
        return;
    }

    client.send(jsonStr);
}


export const TTTools = {



    /** @deprecated use TS classes and done */
    inherits: function(ctor, superCtor)
    {
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
    strEndsWith: function(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    },
    /** @deprecated arrow functions */
    proxy: function(thisArg, callback) {
        return function() {
            callback.call(thisArg, arguments);
        };
    },

    /** @deprecated Array.isArray instead */
    isArray: function(x)
    {
      return (Object.prototype.toString.call( x ) === '[object Array]');
    },

    /** @deprecated TS enums instead */
    checkEnumNoCase: function(value, enumOptions)
    {
        for (var i=0; i<enumOptions.length; i++)
            if (("" + value).toLowerCase() === ("" + enumOptions[i]).toLowerCase())
               return true;
       return false;
    },


    /** @deprecated console.log */
    dumpTree: function(obj, tab)
    {
        tab = tab || "";
        for (var key in obj)
        {
            var val = obj[key];
            if (typeof val === "object")
            {
                console.log(tab + key + " = {");
                TTTools.dumpTree(val, tab+"  ");
                console.log(tab+"}");
            }
            else
                console.log(tab + key + " = " + val);

        }
    },

    /**
     * Performs a flat combination of two data maps (objects)
     **/
    combineObjects: function(a, b)
    {
        var ex = {};
        ex = {...a, ...b};
        //$.extend(true, ex, a, b);
        return ex;
    },

    /** internal helper */
    getObjectClass: function(obj)
    {
        if (obj && obj.constructor && obj.constructor.toString)
        {
            var arr = obj.constructor.toString().match(/function\s*(\w+)/);
            if (arr && arr.length === 2)
            {
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


    enableFullscreen: function(element) {
        if (element.requestFullScreen) {
            element.requestFullScreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        }
    },

    // dump: function(someObj)
    // {
    //     console.log(JSON.stringify(someObj));
    // }
}
