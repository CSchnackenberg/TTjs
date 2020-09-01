/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2020, Christoph Schnackenberg <bluechs@gmx.de>
 * Copyright (c) 2013, Johannes Brosi <mail@jbrosi.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 */
import {getText} from "@ttjs/util/TTTools";


export function TextResources() {};

TextResources.prototype = {
    getType: function() {
        return "text";
    },
    canHandle: function(url:string):boolean {
        return url.toLowerCase().endsWith(".txt"); //(env.strEndsWith(url.toLowerCase(), ".txt"));
    },
    load: function(url:string, callback):void {

        // $.ajax({
        //     url: url,
        //     dataType: "text"
        // }).done(function ( data ) {
        //     callback(true, data);
        // }).fail(function (xhr, status, error){
        //     callback(false, error);
        // });

        getText(
            url,
            data => callback(true, data),
            error => callback(false, error)
        );
    }
};
