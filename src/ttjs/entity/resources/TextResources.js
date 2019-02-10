/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2013, Christoph Schnackenberg <bluechs@gmx.de>
 * Copyright (c) 2013, Johannes Brosi <mail@jbrosi.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 */
define(['ttjs/util/TTTools', 'jquery'], function(env, $)
{    
    "use strict";
	
    // TODO remove jquery dependency
    
	function TextResources() {};	
	
	TextResources.prototype = {
		getType: function() {
			return "text";
		},
		canHandle: function(url) {
            return (env.strEndsWith(url.toLowerCase(), ".txt"));
		},		
        load: function(url, callback) {
			$.ajax({
				url: url,
				dataType: "text"
			}).done(function ( data ) {
				callback(true, data);
			}).fail(function (xhr, status, error){
				callback(false, error);
			});
        }
	};	
	
	return TextResources;
});