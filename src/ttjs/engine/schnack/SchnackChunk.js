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

/**
 * Note: Chunk, Token, ... might be cute-programming. If you are
 * a parser-guy/girl keep that in mind :)
 *
 * And it is a brilliant example of Smurf-Naming convention :-)
 */

/**
 * A 'Chunk' in schnack-terms is basically an array of strings
 * with a type-constant. It can be either text or instruction.
 *
 * The rest is meta-data to be able to print out proper error messages.
 */
export function SchnackChunk(type, linePos) {
    /**
     * This array contains the tokens of the
     * chunk. Depending on the type the meaning
     * of the indices can mean different things.
     *
     * CHUNK_TEXT:
     * [0]		=>	Name/id of the speaker
     *				If no speaker is set it'll be an empty
     *				String
     * [1]		=>  Text of the speaker
     * [n-2]	=>  Name/id of the last speaker
     * [n-1]	=>  Text of the last speaker
     *
     * CHUNK_INSTRUCTION
     * [0]		=>	Function/instruction name. EG @if, @set, @message, ...
     * [...]	=>	Parameters depending instruction
     *
     * If the tokenData is empty it can be ignroed
     */
    this.tokenData = [];
    this.type = type || SchnackChunk.CHUNK_UNK;
    this.linePos = linePos || 0;
    this.firstChunkLine = "";
}

// -----------------------------------------------------

let state = 0;
/** unknown */
SchnackChunk.CHUNK_UNK = state++;
/** a collection of text to print out */
SchnackChunk.CHUNK_TEXT = state++;
/**
 * the chunk contains an instruction
 * like if, else, message etc.
 */
SchnackChunk.CHUNK_INSTRUCTION = state++;
/** The parser is finished */
SchnackChunk.CHUNK_END = state++;

// -----------------------------------------------------

SchnackChunk.prototype = {
    addToken: function (t) {
        if (Array.isArray(t)) {
            for (let i=0; i<t.length; i++)
            this.tokenData.push(t[i]);
        }
        else
            this.tokenData.push(t);
    },
    getTokenAt: function(i) {
        return this.tokenData[i];
    },
    getTokenCount: function() {
        return this.tokenData.length;
    },
    getType: function() {
        return this.type;
    },
    dumpLog: function() {
        let out = "CHUNK ";
        switch(this.type) {
            case SchnackChunk.CHUNK_TEXT:
                out += "TEXT: ";
                break;
            case SchnackChunk.CHUNK_INSTRUCTION:
                out += "INSTR: ";
                break;
            case SchnackChunk.CHUNK_END:
                out += "END: ";
                break;
        }
        for (let i=0; i<this.tokenData.length; i++) {
            out += this.tokenData[i] + " | ";
        }
        console.log("Dump: " + out);
    },
    logError: function() {
        console.error(`Found error [line: ${this.linePos}] near: ${this.firstChunkLine}`);
    },
    getLinePos: function () {
        return this.linePos;
    },

};

//     return SchnackChunk;
//
// });
