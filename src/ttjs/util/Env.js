/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2013, Christoph Schnackenberg <bluchs@gmx.de>
 * Copyright (c) 2013, Johannes Brosi <mail@jbrosi.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 */
define(['jquery'], function($) {
    var env = {
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
        strEndsWith: function(str, suffix) {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        },		
		proxy: function(thisArg, callback) {
            return function() {
                callback.call(thisArg, arguments);
            };
        },        

        isArray: function(x)
        {
          return (Object.prototype.toString.call( x ) === '[object Array]');
        },

        checkEnumNoCase: function(value, enumOptions)
        {        
            for (var i=0; i<enumOptions.length; i++)
                if (("" + value).toLowerCase() === ("" + enumOptions[i]).toLowerCase())
                   return true;
           return false;
        },


        dumpTree: function(obj, tab)
        {
            tab = tab || "";        
            for (var key in obj) 
            {
                var val = obj[key];
                if (typeof val === "object")
                {
                    console.log(tab + key + " = {");
                    env.dumpTree(val, tab+"  ");
                    console.log(tab+"}");
                }
                else
                    console.log(tab + key + " = " + val);

            }    
        },

        /** 
         * Performs a deep combination of two data maps (objects) 
         * 
         * TODO: replace jquery dependency here
         **/
        combineObjects: function(a, b)
        {            
            var ex = {};
            $.extend(true, ex, a, b);
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

        /** 
         * @param {Array} scripts to load scripts 
         * @param {function} ret 
         **/
        loadScripts: function(scripts, ret, prefix)
        {            
			var result = {};
			prefix = "" || prefix;
            var loadScripts = scripts.slice();
            env._loadScripts(loadScripts.reverse(), ret, prefix, result);
        },

        /** @private */
        _loadScripts: function(scripts, ret, prefix, result)
        {
           if (scripts.length <= 0)
           {
               ret(result);
           }
           else
           {        
               var nextSrc = scripts.pop();               
               $.getScript(prefix + nextSrc + ".js")
               .done(function(script, textStatus) 
               {
                   result[nextSrc] = "ok";
                   env._loadScripts(scripts, ret, prefix, result);
               })
               .fail(function(jqxhr, settings, exception) 
               {
                   result[nextSrc] = "err";				                      
                   env._loadScripts(scripts, ret, prefix, result);
               });
           }
        },  

        _loadTextFiles: function(fileList, ret, result)
        {
           if (fileList.length <= 0)
           {
               ret();
           }
           else
           {        
                var nextSrc = fileList.pop();
                console.log("load: " + nextSrc);
                $.ajax(
                {
                    url: nextSrc,
                    async: true,
                    dataType: "text",
                    cache: false
                })
                .done(function(data, textStatus) 
                {
                    result[nextSrc] = data;
                    env._loadTextFiles(fileList, ret, result);
                })
                .fail(function(jqxhr, settings, exception) 
                {                                     
                    console.err(exception);
                    result[nextSrc] = null;
                    result.foundError = true;
                    env._loadTextFiles(fileList, ret, result);
                });
           } 
        },

        loadTextFiles: function(fileList, ret)
        {
            var result = {};       
            this._loadTextFiles(fileList, function()
            {
                ret(result);
            }, result);
        },            

        dump: function(someObj)
        {
            console.log(JSON.stringify(someObj));
        }
    };	
 
	return env;
});