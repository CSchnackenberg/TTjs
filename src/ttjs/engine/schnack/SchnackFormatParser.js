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
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SchnackFormatParser = void 0;
    // -----------------------------------------------------
    let _state = 0;
    const STATE_TEXT = _state++;
    const STATE_SYMBOL = _state++;
    const EVENT_START = "start";
    const EVENT_END = "end";
    const EVENT_ERR = "error";
    exports.SchnackFormatParser = {
        EVENT_START: EVENT_START,
        EVENT_END: EVENT_END,
        EVENT_ERR: EVENT_ERR,
        /**
         * Can parse this:
         *
         * 111{a:222{b:333}444}555
         *     ^     ^
         *     |     second symbol: "b"
         *     first Symbol: "a"
         *
         * NOTE: Potentially puts heavy load on GC
         *
         * const cb = (typ, symbol, stack, raw, rawIndex) => {
         *      console.log(typ, symbol, stack, raw, rawIndex);
         * }
         * const txt = parse("a{b:xxx{c:yyy}zzz}", cb);
         * console.log(txt);
         *
         * // output:
         * > start b [ 'b' ] a 1
         * > start c [ 'b', 'c' ] axxx 4
         * > end c [ 'b' ] axxxyyy 7
         * > end b [] axxxyyyzzz 10
         * > axxxyyyzzz
         *
         */
        parse: function (formatedText, callback) {
            let state = STATE_TEXT;
            const symbolStack = [];
            let symbol = "";
            let rawCharIndex = 0;
            let rawText = "";
            for (let i = 0; i < formatedText.length; i++) {
                const c = formatedText[i];
                if (state == STATE_SYMBOL) {
                    if (c == ':') {
                        state = STATE_TEXT;
                        symbolStack.push(symbol);
                        if (callback)
                            callback(EVENT_START, symbol, symbolStack, rawText, rawCharIndex);
                    }
                    else {
                        symbol += c;
                        continue;
                    }
                }
                else if (state == STATE_TEXT) {
                    if (c == '{' && (i == 0 || formatedText[i - 1] != '\\')) {
                        state = STATE_SYMBOL;
                        symbol = "";
                        continue;
                    }
                    else if (c == '}' && (i == 0 || formatedText[i - 1] != '\\')) {
                        if (symbolStack.length == 0) {
                            if (callback)
                                callback(EVENT_ERR, null, symbolStack, rawText, rawCharIndex);
                        }
                        else {
                            const popSym = symbolStack.pop();
                            if (callback)
                                callback(EVENT_END, popSym, symbolStack, rawText, rawCharIndex);
                        }
                    }
                    else {
                        if (c == '\\') {
                            if (i + 1 < formatedText.length && formatedText[i + 1] != '\\') {
                                // wee want to keep the
                            }
                            else {
                                continue;
                            }
                        }
                        rawText += c;
                        rawCharIndex++;
                    }
                }
            }
            return rawText;
        }
    };
});
// -----------------------------------------------------
// SchnackFormatParser.parse = ;
//     return SchnackFormatParser;
//
// });
//# sourceMappingURL=SchnackFormatParser.js.map