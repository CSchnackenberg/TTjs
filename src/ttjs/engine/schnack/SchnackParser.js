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
define(["require", "exports", "./SchnackChunk", "./SchnackUtil"], function (require, exports, SchnackChunk_1, SchnackUtil_1) {
    // define([
    //     './SchnackChunk',
    //     './SchnackUtil'
    // ], function (
    //     SchnackChunk,
    //     SchnackUtil,
    // ) {
    "use strict";
    exports.__esModule = true;
    exports.SchnackParser = void 0;
    function SchnackParser(fileName, source) {
        /** source code of the file */
        this.source = source || "";
        /**
         * id of the schnack-script.
         * the id is e
         */
        this.schnackId = this.parseSchnackId(fileName || "");
        /**  the readposition for readNextLine */
        this.readPosition = 0;
        /** saved position for resetLine */
        this.savedLine = 0;
        /** current lineposition */
        this.linePos = 0;
        /** always the last chunk */
        this.savedChunk = new SchnackChunk_1.SchnackChunk(SchnackChunk_1.SchnackChunk.CHUNK_UNK);
        /** */
        this.useLastChunk = false;
        /** tmp variable to simulate c++ refs */
        this._refString = { ref: "" };
    }
    exports.SchnackParser = SchnackParser;
    // -----------------------------------------------------
    SchnackParser.prototype = {
        resetLine: function () {
            if (this.readPosition == this.savedLine) {
                return;
            }
            this.linePos--;
            this.readPosition = this.savedLine;
        },
        readNextLine: function (outLine) {
            outLine.ref = "";
            if (this.readPosition >= this.source.length) {
                return false;
            }
            this.savedLine = this.readPosition;
            while (this.readPosition < this.source.length) {
                var c = this.source[this.readPosition++];
                if (c == "\r")
                    continue;
                if (c == "\n") {
                    this.linePos++;
                    break;
                }
                outLine.ref += c;
            }
            outLine.ref = outLine.ref.trim();
            return true;
        },
        parseSchnackId: function (fileNameWithPath) {
            var p = fileNameWithPath.lastIndexOf("/") + 1;
            var fileName = fileNameWithPath.substring(p);
            var dot = fileName.indexOf(".");
            var r = fileName.toLowerCase().substring(0, dot > 0 ? dot : undefined);
            return r;
        },
        parseTextChunk: function (firstLine, chunk) {
            var text = "";
            if (firstLine[0] == '[') {
                var speaker = firstLine.substring(1, firstLine.length - 1);
                chunk.addToken(speaker);
            }
            else {
                chunk.addToken("");
                text = firstLine;
            }
            var isMore = false;
            var line = "";
            while (true) {
                isMore = this.readNextLine(this._refString);
                line = this._refString.ref;
                if (!isMore) {
                    break;
                }
                if (!line) {
                    // if we are currently reading a text
                    // we add a \n for each line.
                    // BUT we do it only once. Multiple \n's won't
                    // be recognized.
                    if (text && text[text.length - 1] != '\n') {
                        text += '\n';
                    }
                    continue;
                }
                var route = line[0];
                switch (route) {
                    case '#':
                        continue;
                    case '[':
                        if (text)
                            chunk.addToken(text);
                        text = "";
                        chunk.addToken(line.substring(1, line.length - 1));
                        break;
                    case '@':
                        if (text) {
                            chunk.addToken(text);
                        }
                        this.resetLine();
                        return;
                    default:
                        if (!text)
                            text = line;
                        else
                            text += '\n' + line;
                        break;
                }
            }
            if (text) {
                chunk.addToken(text);
            }
        },
        parseInstructionChunk: function (instruction, chunk) {
            // something like @message music mute
            if (instruction.startsWith("@message")) {
                var pos = instruction.indexOf(' ');
                if (pos == -1) {
                    console.error("parseInstructionChunk()" + "[line:" + this.linePos + "] Invalid command: " + instruction + ". At least one Parameter is required!");
                    return;
                }
                chunk.addToken(instruction.substring(0, pos));
                var paramPart = instruction.substring(pos);
                var parts = paramPart.split(',');
                for (var i = 0; i < parts.length; i++) {
                    var trimmedPart = parts[i].trim();
                    if (trimmedPart) {
                        chunk.addToken(trimmedPart);
                    }
                }
            }
            else if (instruction == "@else" ||
                instruction == "@end" ||
                instruction == "@endif") {
                chunk.addToken(instruction);
            }
            else if (instruction.startsWith("@set")) {
                this.parseHelperAssign(instruction, chunk);
            }
            else if (instruction.startsWith("@elseif") || instruction.startsWith("@if")) {
                this.parseHelperCondition(instruction, chunk);
            }
            else if (instruction == "@select") {
                chunk.addToken(instruction);
                var line = "";
                while (true) {
                    var isMore = this.readNextLine(this._refString);
                    var line_1 = this._refString.ref;
                    if (!isMore) {
                        console.error("parseInstructionChunk()" + "[line:" + this.linePos + "] @select without @endselect!");
                        return;
                    }
                    if (line_1 && line_1[0] == '@' && line_1 != "@endselect") {
                        console.error("parseInstructionChunk()" + "[line:" + this.linePos + "] @select expects @endselect!");
                        return;
                    }
                    if (!line_1 || line_1[0] == "#") {
                        continue;
                    }
                    if (line_1 == "@endselect") {
                        break;
                    }
                    var parts = SchnackUtil_1.SchnackUtil.splitTrimmed(line_1, ':', false, 2);
                    if (parts.length == 0) {
                        console.error("parseInstructionChunk()" + "[line:" + this.linePos + "] @select expects a list of possible answers line and semicolon seperated!");
                        return;
                    }
                    chunk.addToken(parts);
                }
            }
            else if (instruction == "@endselect") {
                console.error("parseInstructionChunk()" + "[line:" + this.linePos + "] Unexpected @endselect");
                return;
            }
            else {
                console.error("parseInstructionChunk()" + "[line:" + this.linePos + "] Unknown instruction: " + instruction);
                return;
            }
        },
        parseHelperAssign: function (instruction, chunk) {
            var parts = SchnackUtil_1.SchnackUtil.splitTrimmed(instruction, ' ', true, 4);
            chunk.addToken(parts);
        },
        parseHelperCondition: function (instruction, chunk) {
            var parts = SchnackUtil_1.SchnackUtil.splitTrimmed(instruction, ' ', true, 4);
            chunk.addToken(parts);
        },
        getSchnackId: function () {
            return this.schnackId;
        },
        parseNextChunk: function () {
            if (this.useLastChunk) {
                this.useLastChunk = false;
                return this.savedChunk;
            }
            var lastLinePos = 0;
            var isMore = false;
            var line = "";
            while (true) {
                lastLinePos = this.linePos;
                isMore = this.readNextLine(this._refString);
                line = this._refString.ref;
                if (!isMore) {
                    var c = new SchnackChunk_1.SchnackChunk(SchnackChunk_1.SchnackChunk.CHUNK_END);
                    c.linePos = lastLinePos;
                    return c;
                }
                if (line) {
                    if (line[0] == '#') {
                        continue;
                    }
                    else {
                        break;
                    }
                }
            }
            if (line[0] == '@') {
                var ret = new SchnackChunk_1.SchnackChunk(SchnackChunk_1.SchnackChunk.CHUNK_INSTRUCTION);
                ret.linePos = lastLinePos;
                ret.firstChunkLine = line;
                this.parseInstructionChunk(line, ret);
                this.savedChunk = ret;
                return ret;
            }
            else {
                var ret = new SchnackChunk_1.SchnackChunk(SchnackChunk_1.SchnackChunk.CHUNK_TEXT);
                ret.linePos = lastLinePos;
                ret.firstChunkLine = line;
                this.parseTextChunk(line, ret);
                this.savedChunk = ret;
                return ret;
            }
        },
        restoreLastChunk: function () {
            this.useLastChunk = true;
        },
    };
});
//     return SchnackParser;
//
// });
//# sourceMappingURL=SchnackParser.js.map