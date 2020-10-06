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
//     './SchnackVarValue'
// ], function (
//     SchnackVarValue
// ) {

"use strict";


import {SchnackVarValue} from "./SchnackVarValue";


export function SchnackVar(name, value) {
    this.name = name || "";
    this.value = new SchnackVarValue(value /* intentional. constr takes care of null etc */);
    this.persistent = false;
    this.scope = SchnackVar.SCOPE_GAME;
}

// -----------------------------------------------------

let state = 0;
/** variable exists during the entire game */
SchnackVar.SCOPE_GAME = state++;
/** variable exists during the current map */
SchnackVar.SCOPE_MAP = state++;
/** variable exists throut in the current talk session */
SchnackVar.SCOPE_SESSION = state++;


// -----------------------------------------------------

SchnackVar.prototype = {
    getName: function () {
        return this.name;
    },
    /** @returns SchnackVarValue */
    getValue: function () {
        return this.value;
    },
    dumpString: function () {
        let out = "{";
        switch(this.scope) {
            case SchnackVar.SCOPE_GAME:
                out += "[GAME]";
                break;
            case SchnackVar.SCOPE_SESSION:
                out += "[SESSION]";
                break;
            case SchnackVar.SCOPE_MAP:
                out += "[MAP]";
                break;
        }

        out += " = " + this.value.dumpString();
        return out;
    },
    isPersistent: function () {
        return this.persistent;
    },
    setPersistent: function(p) {
        this.persistent = p ? true : false;
    },
    getScope: function() {
        return this.scope;
    },
    setScope: function(s) {
        if (s == SchnackVar.SCOPE_SESSION)
            this.scope = s;
        else if (s == SchnackVar.SCOPE_MAP)
            this.scope = s;
        else if (s == SchnackVar.SCOPE_GAME)
            this.scope = SchnackVar.SCOPE_GAME;
        else
            console.warn("setScope(): unknown", s);
    },
};

//     return SchnackVar;
//
// });
