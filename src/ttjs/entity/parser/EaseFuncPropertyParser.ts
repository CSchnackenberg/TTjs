/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2019, Christoph Schnackenberg <bluechs@gmx.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 */
// define([
//     'ttjs/lib/lodash',
//     'ttjs/engine/2d/flint/Easing',
// ], function(
//     _,
//     Easing
// ) {

import * as _ from '@ttjs/lib/lodash'
import {Easing} from '@ttjs/engine/2d/flint/Easing'

"use strict";

/**
 * Translates a string to a ease function.
 * This function allows a great deal of
 *
 * Examples:
 *
 * sine.out => Easing.Sine.easeOut
 * sine.in => Easing.Sine.easeIn
 * sine.inOut => Easing.Sine.easeInOut
 * sine => Easing.Sine.easeInOut
 *
 * ["sine", "out"] => Easing.Sine.easeOut
 *
 */
export function EaseFuncPropertyParser() {
}

EaseFuncPropertyParser._issue = null as any;

/**
 * This function does the actual transform.
 *
 * It returns the matching ease function. If null is returned check for EaseFuncPropertyParser._issue to determine
 * the reason.
 *
 * @static
 */
EaseFuncPropertyParser.toEaseFunc = (easeFuncDef) => {

    EaseFuncPropertyParser._issue = null;

    let easeName = "";
    let easeMode = "inout";


    // We accept string like this: Sine.in
    if (_.isString(easeFuncDef)) {
        const splitPos = easeFuncDef.indexOf(".");
        if (splitPos == -1) { // no '.'
            easeName = easeFuncDef;
        }
        else {
            const parts = easeFuncDef.split(".");
            easeName = parts[0];
            easeMode = parts[1];
        }
    }
    // we also accept an array with two values ["sine", "in"]
    else if (_.isArray(easeFuncDef) && easeFuncDef.length == 2) {
        easeName = easeFuncDef[0];
        easeMode = easeFuncDef[1];
    }
    else {
        EaseFuncPropertyParser._issue = "Unknown type for ease-func. Provide a string or an array with two values.";
        return null;
    }


    // to avoid (very slow) toLowerCase we simply do some
    // switching here.

    let easeType:any = null;
    switch(easeName) {
        case "back": case "Back": easeType = Easing.Back; break;
        case "bounce": case "Bounce": easeType = Easing.Bounce; break;
        case "circular": case "Circular": easeType = Easing.Circular; break;
        case "cubic": case "Cubic": easeType = Easing.Cubic; break;
        case "elastic": case "Elastic": easeType = Easing.Elastic; break;
        case "exponential": case "Exponential": easeType = Easing.Exponential; break;
        case "linear": case "Linear": easeType = Easing.Linear; break;
        case "quadratic": case "Quadratic": easeType = Easing.Quadratic; break;
        case "quartic": case "Quartic": easeType = Easing.Quartic; break;
        case "quintic": case "Quintic": easeType = Easing.Quintic; break;
        case "sine": case "Sine": easeType = Easing.Sine; break;
    }
    if (!easeType) {
        EaseFuncPropertyParser._issue =  "Unknown ease type: '" + easeName + "'";
        return null;
    }


    let finalFunc = null;
    switch(easeMode) {
        case "in": case "In": case "easeIn": case "EaseIn":
            finalFunc = easeType["easeIn"];
            break;
        case "out": case "Out": case "easeOut": case "EaseOut":
            finalFunc = easeType["easeOut"];
            break;
        case "inout": case "inOut": case "easeInOut": case "EaseInOut":
            finalFunc = easeType["easeInOut"];
            break;
    }

    if (!easeType) {
        EaseFuncPropertyParser._issue =  "For ease type: '" + easeName + "' unknown func: '" + easeMode + "'";
        return null;
    }

    return finalFunc;
};

EaseFuncPropertyParser.prototype = {

    /**
     *
     * @param {String} propertyName the name
     * @param {Object} propertyInfo data from the component
     * @param {Object} instanceValue unparsed value from the instance
     * @param {Object} outProps object that
     * @return {Mixed} undefined: okay, string: error desc;
     */
    parse: function(propertyName, propertyInfo, instanceValue, outProps)
    {
        const finalFunc = EaseFuncPropertyParser.toEaseFunc(instanceValue);
        if (finalFunc == null) {
            return EaseFuncPropertyParser._issue;
        }

        outProps[propertyName] = finalFunc;
    }
};
    
    
//     return EaseFuncPropertyParser;
// });