/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2020, Christoph Schnackenberg <bluechs@gmx.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 *
 * SchnackScript
 */
// define([
// ], function (
// ) {

"use strict";


export function SchnackResult(data, type) {
    this.type = type;
    this.resultData = data;
}

// -----------------------------------------------------

let state = 0;
SchnackResult.SCHNACKRES_TEXT = state++;
SchnackResult.SCHNACKRES_SELECT = state++;
SchnackResult.SCHNACKRES_VARCHANGE = state++;
SchnackResult.SCHNACKRES_MSG = state++;
SchnackResult.SCHNACKRES_FINISHED = state++;
SchnackResult.SCHNACKRES_UNEXPECTED_END = state++;
SchnackResult.SCHNACKRES_ERROR = state++;

// -----------------------------------------------------

SchnackResult.prototype = {
    getResultAsVarChange: function () {
        if (this.type == SchnackResult.SCHNACKRES_VARCHANGE)
            return this.resultData;
        return null;
    },
    getResultAsSelect: function () {
        if (this.type == SchnackResult.SCHNACKRES_SELECT)
            return this.resultData;
        return null;
    },
    getAsSchnackMessage: function () {
        if (this.type == SchnackResult.SCHNACKRES_MSG)
            return this.resultData;
        return null;
    },
    getAsSchnackText: function () {
        if (this.type == SchnackResult.SCHNACKRES_TEXT)
            return this.resultData;
        return null;
    },
    getType: function () {
        return this.type;
    },
    getData: function() {
        return this.resultData;
    }

};

//     return SchnackResult;
//
// });
