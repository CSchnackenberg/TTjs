define(["require", "exports", "./SchnackParser", "./SchnackVar", "./SchnackVarValue", "./SchnackChunk", "./SchnackResult", "./SchnackUtil"], function (require, exports, SchnackParser_1, SchnackVar_1, SchnackVarValue_1, SchnackChunk_1, SchnackResult_1, SchnackUtil_1) {
    "use strict";
    exports.__esModule = true;
    exports.SchnackInterpreter = void 0;
    // define([
    //     './SchnackParser',
    //     './SchnackVar',
    //     './SchnackVarValue',
    //     './SchnackChunk',
    //     './SchnackResult',
    //     './SchnackUtil',
    // ], function (
    //     SchnackParser,
    //     SchnackVar,
    //     SchnackVarValue,
    //     SchnackChunk,
    //     SchnackResult,
    //     SchnackUtil,
    // ) {
    "use strict";
    var LEVEL_DEPTH = 8;
    var MATCH_NAME = /^[a-zA-Z][a-zA-Z0-9\._]*$/g;
    /**
     * Creates a new SchnackInterpreter including a scope etc.
     *
     * @param fileProvider needs to be a function: (file) => {return content}. Must by sync.
     * @constructor
     */
    function SchnackInterpreter(fileProvider) {
        this.currentParser = null;
        this.storage = {};
        this.callScope = 0;
        this.lastFile = "";
        this.lastFileScope = "";
        this.ifLevel = 0;
        this.ifLevelDone = [];
        this.fileProvider = fileProvider;
    }
    exports.SchnackInterpreter = SchnackInterpreter;
    // -----------------------------------------------------
    SchnackInterpreter.prototype = {
        /**
         * Parses the script-file. The results will be handled
         * with the listener.
         * You should
         *
         * NOTE: You can only parse one script at a time.
         * It'll assert if there is already a script
         */
        initScript: function (file, alternativeScopeName) {
            var scopeName = alternativeScopeName || file;
            this.lastFileScope = scopeName;
            this.lastFile = file;
            this.callScope = 0;
            this.ifLevel = 0;
            this.ifLevelDone = [];
            for (var i = 0; i < LEVEL_DEPTH; i++)
                this.ifLevelDone.push(false);
            var _code = this.fileProvider(file);
            this.currentParser = new SchnackParser_1.SchnackParser(scopeName, _code);
        },
        /**  executes a script from a string */
        initScriptFromSource: function (pseudoFileName, sourceCode) {
            this.lastFile = "";
            this.callScope = 0;
            this.ifLevel = 0;
            this.ifLevelDone = [];
            for (var i = 0; i < LEVEL_DEPTH; i++)
                this.ifLevelDone.push(false);
            this.currentParser = new SchnackParser_1.SchnackParser(pseudoFileName, sourceCode);
        },
        /** call this after a selection */
        reinitAfterSelection: function () {
            if (!this.lastFile)
                return;
            this.initScript(this.lastFile, this.lastFileScope);
        },
        /** executes script-step */
        executeScriptStep: function () {
            if (!this.currentParser) {
                console.error("parse is null");
                return null;
            }
            var chunk = this.currentParser.parseNextChunk();
            while (this.currentParser != null && chunk.getType() != SchnackChunk_1.SchnackChunk.CHUNK_END) {
                if (chunk.getType() == SchnackChunk_1.SchnackChunk.CHUNK_TEXT) {
                    var type = SchnackResult_1.SchnackResult.SCHNACKRES_TEXT;
                    var data = [];
                    for (var i = 0; i < chunk.getTokenCount(); i += 2) {
                        data.push({
                            personId: chunk.getTokenAt(i + 0),
                            text: chunk.getTokenAt(i + 1),
                        });
                    }
                    return new SchnackResult_1.SchnackResult(data, type);
                }
                else if (chunk.getType() == SchnackChunk_1.SchnackChunk.CHUNK_INSTRUCTION) {
                    var instrToken = chunk.getTokenAt(0);
                    if (chunk.getTokenCount() == 0) {
                        console.error("Error parsing script  Invalid token");
                        chunk.logError();
                        return new SchnackResult_1.SchnackResult(null, SchnackResult_1.SchnackResult.SCHNACKRES_ERROR);
                    }
                    if (instrToken === "@end") {
                        this.currentParser = null;
                        return new SchnackResult_1.SchnackResult(null, SchnackResult_1.SchnackResult.SCHNACKRES_FINISHED);
                    }
                    else if (instrToken == "@message") {
                        var data = [];
                        for (var i = 1; i < chunk.getTokenCount(); i++) {
                            data.push(chunk.getTokenAt(i));
                        }
                        return new SchnackResult_1.SchnackResult(data, SchnackResult_1.SchnackResult.SCHNACKRES_MSG);
                    }
                    else if (instrToken == "@select") {
                        var data = {};
                        var rawQuestionVarName = chunk.getTokenAt(1);
                        if (!this.checkVarName(rawQuestionVarName)) {
                            console.error("@select invalid character in question-varname");
                            chunk.logError();
                            return new SchnackResult_1.SchnackResult(null, SchnackResult_1.SchnackResult.SCHNACKRES_ERROR);
                        }
                        data.questionVar = this.getVarName(rawQuestionVarName);
                        data.question = chunk.getTokenAt(2);
                        data.answerOptions = {};
                        for (var i = 3; i < chunk.getTokenCount(); i += 2) {
                            var insert = true;
                            var varNameOrCondition = chunk.getTokenAt(i + 0);
                            var varName = "";
                            var conditionIndex = varNameOrCondition.indexOf('(');
                            if (conditionIndex > 0) {
                                varName = varNameOrCondition.substr(0, conditionIndex);
                                var condition = varNameOrCondition.substr(conditionIndex + 1, varNameOrCondition.length - (conditionIndex + 2));
                                var conditionParts = SchnackUtil_1.SchnackUtil.splitTrimmed(condition, ' ', true);
                                var pseudoChunk = new SchnackChunk_1.SchnackChunk(SchnackChunk_1.SchnackChunk.CHUNK_INSTRUCTION, chunk.getLinePos());
                                pseudoChunk.addToken("@if");
                                pseudoChunk.addToken(conditionParts);
                                if (!this.checkConditionParameter(pseudoChunk)) {
                                    console.error("@select invalid condition in select variable: " + condition);
                                    chunk.logError();
                                    return new SchnackResult_1.SchnackResult(null, SchnackResult_1.SchnackResult.SCHNACKRES_ERROR);
                                }
                                if (!this.checkConditionVarName(pseudoChunk)) {
                                    console.error("@select invalid varname in selection condition: " + condition);
                                    chunk.logError();
                                    return new SchnackResult_1.SchnackResult(null, SchnackResult_1.SchnackResult.SCHNACKRES_ERROR);
                                }
                                if (!this.checkCondition(pseudoChunk)) {
                                    insert = false;
                                }
                            }
                            else {
                                varName = varNameOrCondition;
                            }
                            if (!this.checkVarName(varName)) {
                                console.error("@select invalid answer-varname: " + varName);
                                chunk.logError();
                                return new SchnackResult_1.SchnackResult(null, SchnackResult_1.SchnackResult.SCHNACKRES_ERROR);
                            }
                            if (insert) {
                                data.answerOptions[varName] = chunk.getTokenAt(i + 1);
                            }
                        }
                        this.currentParser = null;
                        return new SchnackResult_1.SchnackResult(data, SchnackResult_1.SchnackResult.SCHNACKRES_SELECT);
                    }
                    else if (instrToken == "@set") {
                        if (!this.checkSetParameter(chunk)) {
                            console.error("@set Expects @set <variable> = <value> or @set <variable> ++, -- or @set <variable> +=, -= <value> or @set <variable> .= <value>");
                            chunk.logError();
                            return new SchnackResult_1.SchnackResult(null, SchnackResult_1.SchnackResult.SCHNACKRES_ERROR);
                        }
                        // let's fetch the target variable
                        var rawVarName = chunk.getTokenAt(1);
                        var isOkay = this.checkVarName(rawVarName);
                        if (!isOkay) {
                            console.error("@set invalid varname");
                            chunk.logError();
                            return new SchnackResult_1.SchnackResult(null, SchnackResult_1.SchnackResult.SCHNACKRES_ERROR);
                        }
                        var varName = this.getVarName(rawVarName);
                        var vv = this.storage[varName] || false;
                        var v = new SchnackVarValue_1.SchnackVarValue(vv ? vv.getValue() : null);
                        var operatorToken = chunk.getTokenAt(2);
                        // perform the operation
                        if (chunk.getTokenCount() == 3) {
                            switch (operatorToken) {
                                case "++":
                                    v.increment();
                                    break;
                                case "--":
                                    v.decrement();
                                    break;
                                default:
                                    chunk.logError();
                                    return new SchnackResult_1.SchnackResult(null, SchnackResult_1.SchnackResult.SCHNACKRES_ERROR);
                            }
                        }
                        else {
                            var varValue = chunk.getTokenAt(3);
                            switch (operatorToken) {
                                case "=":
                                    v.setValue(varValue);
                                    break;
                                case "+=":
                                    v.incrementBy(varValue);
                                    break;
                                case "-=":
                                    v.decrementBy(varValue);
                                    break;
                                case ".=":
                                    v.concat(varValue);
                                    break;
                                default:
                                    chunk.logError();
                                    return new SchnackResult_1.SchnackResult(null, SchnackResult_1.SchnackResult.SCHNACKRES_ERROR);
                            }
                        }
                        // get back data for reporting
                        var scope = this.getScopeByName(varName);
                        var oldVar = vv;
                        var newVar = this.setVar(scope, varName, v);
                        return new SchnackResult_1.SchnackResult({
                            newVar: newVar,
                            oldVar: oldVar,
                            oldVarExist: vv ? true : false,
                        }, SchnackResult_1.SchnackResult.SCHNACKRES_VARCHANGE);
                    }
                    else if (instrToken == "@if") {
                        if (!this.checkConditionParameter(chunk)) {
                            console.error("@if Expects @if =, !=, >=, <=, <, > <value>");
                            chunk.logError();
                            return new SchnackResult_1.SchnackResult(null, SchnackResult_1.SchnackResult.SCHNACKRES_ERROR);
                        }
                        this.ifLevel++;
                        this.ifLevelDone[this.ifLevel] = false;
                        var varNameOkay = this.checkConditionVarName(chunk);
                        if (!varNameOkay) {
                            console.error("@if invalid varname");
                            chunk.logError();
                            return new SchnackResult_1.SchnackResult(null, SchnackResult_1.SchnackResult.SCHNACKRES_ERROR);
                        }
                        var condition = this.checkCondition(chunk);
                        if (condition) {
                            this.ifLevelDone[this.ifLevel] = true;
                        }
                        else {
                            this.skipTillEndif();
                        }
                    }
                    else if (instrToken == "@elseif") {
                        if (this.ifLevel == 0) {
                            console.error("SchnackInterpreter @elseif without if!");
                            chunk.logError();
                            return new SchnackResult_1.SchnackResult(null, SchnackResult_1.SchnackResult.SCHNACKRES_ERROR);
                        }
                        if (!this.checkConditionParameter(chunk)) {
                            console.error("@elseif expects @elseif =, !=, >=, <=, <, > <value>");
                            chunk.logError();
                            return new SchnackResult_1.SchnackResult(null, SchnackResult_1.SchnackResult.SCHNACKRES_ERROR);
                        }
                        if (this.ifLevelDone[this.ifLevel]) {
                            // a previous if/elseif already
                            // fulfilled the condition and was executed
                            // so we can just skip it here.
                            this.skipTillEndif();
                        }
                        else {
                            var varNameOkay = this.checkConditionVarName(chunk);
                            if (!varNameOkay) {
                                console.error("@elseif invalid varname");
                                chunk.logError();
                                return new SchnackResult_1.SchnackResult(null, SchnackResult_1.SchnackResult.SCHNACKRES_ERROR);
                            }
                            var condition = this.checkCondition(chunk);
                            if (condition) {
                                // the block has not been executed
                                // and we fulfill the condition: lets execute it
                                this.ifLevelDone[this.ifLevel] = true;
                            }
                            else {
                                // the block is not executed and
                                // we do not fulfill the condition:
                                // lets search for the next elseif/else
                                this.skipTillEndif();
                            }
                        }
                    }
                    else if (instrToken == "@else") {
                        if (this.ifLevel == 0) {
                            console.error("SchnackInterpreter @else without if!");
                            chunk.logError();
                            return new SchnackResult_1.SchnackResult(null, SchnackResult_1.SchnackResult.SCHNACKRES_ERROR);
                        }
                        if (this.ifLevelDone[this.ifLevel] == false) {
                            // we are in the elseblock and
                            // until now all previous blocks have
                            // not been able to fulfull the if/elseif
                            // conditions.
                            //
                            // then we can exeicute it now :)
                            this.ifLevelDone[this.ifLevel] = true;
                        }
                        else {
                            // a previous if/elseif already
                            // fulfilled the condition and was executed
                            // so we can just skip it here.
                            this.skipTillEndif();
                        }
                    }
                    else if (chunk.getTokenAt(0) == "@endif") {
                        if (this.ifLevel == 0) {
                            console.error("SchnackInterpreter @endif without if!");
                            chunk.logError();
                            return new SchnackResult_1.SchnackResult(null, SchnackResult_1.SchnackResult.SCHNACKRES_ERROR);
                        }
                        // we are leaving the endif block :)
                        this.ifLevelDone[this.ifLevel] = true;
                        this.ifLevel--;
                    }
                }
                chunk = this.currentParser.parseNextChunk();
            }
            if (this.ifLevel > 0) {
                console.error("SchnackInterpreter Found unexpected end!");
                return new SchnackResult_1.SchnackResult(null, SchnackResult_1.SchnackResult.SCHNACKRES_UNEXPECTED_END);
            }
            if (chunk.getType() == SchnackChunk_1.SchnackChunk.CHUNK_END) {
                this.currentParser = null;
                return new SchnackResult_1.SchnackResult(null, SchnackResult_1.SchnackResult.SCHNACKRES_FINISHED);
            }
            // here we actually have an unexpected state :-/
            return new SchnackResult_1.SchnackResult(null, SchnackResult_1.SchnackResult.SCHNACKRES_UNEXPECTED_END);
        },
        /**
         *
         * @returns SchnackVar the created object holding the value
         */
        setVar: function (scope, name, val) {
            var sv = new SchnackVar_1.SchnackVar(name, val);
            sv.setPersistent(true);
            sv.setScope(scope);
            this.storage[name] = sv;
            return sv;
        },
        /**
         * @returns boolean true on success
         */
        removeVar: function (name) {
            if (this.storage[name]) {
                delete this.storage[name];
                return true;
            }
            return false;
        },
        /**
         * @returns {SchnackVar|boolean}
         */
        getVar: function (name) {
            return this.storage[name] || false;
        },
        /**
         * returns a vector with all variables that are
         * flagged as persistant
         */
        getPersistentVars: function () {
            var _this = this;
            var out = [];
            Object.keys(this.storage).forEach(function (k) {
                var v = _this.storage[k];
                if (v.isPersistent())
                    out.push(v);
            });
            return out;
        },
        /** removes all variables that have map-scope. */
        releaseMapScope: function () {
            var _this = this;
            Object.keys(this.storage).forEach(function (k) {
                var v = _this.storage[k];
                if (v.getScope() == SchnackVar_1.SchnackVar.SCOPE_MAP) {
                    delete _this.storage[k];
                }
            });
        },
        /** removes all variables that have session-scope. */
        releaseSessionScope: function () {
            var _this = this;
            Object.keys(this.storage).forEach(function (k) {
                var v = _this.storage[k];
                if (v.getScope() == SchnackVar_1.SchnackVar.SCOPE_SESSION) {
                    delete _this.storage[k];
                }
            });
        },
        getScopeByName: function (varName) {
            if (varName.startsWith("map.")) {
                return SchnackVar_1.SchnackVar.SCOPE_MAP;
            }
            else if (varName.startsWith("session.")) {
                return SchnackVar_1.SchnackVar.SCOPE_SESSION;
            }
            return SchnackVar_1.SchnackVar.SCOPE_GAME;
        },
        /** checks if the given condition has a valid var name */
        checkConditionVarName: function (condition) {
            var rawVarNameFromScript = condition.getTokenAt(1);
            return this.checkVarName(rawVarNameFromScript);
        },
        /** retruns true if the condition is true */
        checkCondition: function (condition) {
            // fetch left hand var
            var rawVarNameFromScript = condition.getTokenAt(1);
            var varName = this.getVarName(rawVarNameFromScript);
            var potentialVarObj = this.getVar(varName);
            var varObj = potentialVarObj ? potentialVarObj : new SchnackVar_1.SchnackVar(varName, 0);
            // fetch right hand value
            var cmp = new SchnackVarValue_1.SchnackVarValue(condition.getTokenAt(3));
            // perform condition checking
            var cmpToken = condition.getTokenAt(2);
            switch (cmpToken) {
                case "=":
                case "==":
                    return varObj.getValue().equals(cmp);
                case "!=":
                    return !varObj.getValue().equals(cmp);
                case "<":
                    return varObj.getValue().compare(cmp) < 0;
                case ">":
                    return varObj.getValue().compare(cmp) > 0;
                case "<=":
                    return varObj.getValue().compare(cmp) < 0 ||
                        varObj.getValue().equals(cmp);
                case ">=":
                    return varObj.getValue().compare(cmp) > 0 ||
                        varObj.getValue().equals(cmp);
                default:
                    console.error("SchnackInterpreter::checkCondition Unknown comperator " + cmpToken);
            }
            return false;
        },
        checkConditionParameter: function (condition) {
            if (condition.getTokenCount() != 4)
                return false;
            var cmpToken = condition.getTokenAt(2);
            switch (cmpToken) {
                case "=":
                case "==":
                case "!=":
                case "<":
                case ">":
                case "<=":
                case ">=":
                    break;
                default:
                    return false;
            }
            return true;
        },
        checkSetParameter: function (setChunk) {
            var tokenCount = setChunk.getTokenCount();
            var operatorToken = setChunk.getTokenAt(2);
            if (tokenCount == 3) {
                if (operatorToken != "++" && operatorToken != "--") {
                    console.error("@set invalid operator:", operatorToken);
                    return false;
                }
            }
            else if (tokenCount == 4) {
                if (operatorToken != "+" &&
                    operatorToken != "-" &&
                    operatorToken != "-=" &&
                    operatorToken != "+=" &&
                    operatorToken != ".=" &&
                    operatorToken != "=") {
                    console.error("@set invalid operator:", operatorToken);
                    return false;
                }
            }
            else {
                console.error("@set invalid parameter count", tokenCount);
                return false;
            }
            return true;
        },
        skipTillEndif: function () {
            var level = 0;
            var chunk = this.currentParser.parseNextChunk();
            while (chunk.getType() != SchnackChunk_1.SchnackChunk.CHUNK_END) {
                if (chunk.getType() == SchnackChunk_1.SchnackChunk.CHUNK_INSTRUCTION) {
                    var instrToken = chunk.getTokenAt(0);
                    switch (instrToken) {
                        case "@if":
                            level++;
                            break;
                        case "@elseif":
                        case "@else":
                            if (level == 0) {
                                this.currentParser.restoreLastChunk();
                                return;
                            }
                            break;
                        case "@endif":
                            if (level == 0) {
                                this.currentParser.restoreLastChunk();
                                return;
                            }
                            level--;
                            break;
                    }
                }
                chunk = this.currentParser.parseNextChunk();
            }
            console.error("SchnackInterpreter() missing @endif");
        },
        /** builds a var name considering the current script context. */
        getVarName: function (rawName) {
            if (!this.checkVarName(rawName))
                console.error("getVarName() invalid name: " + rawName);
            if (rawName.indexOf(".") >= 0)
                return rawName;
            var prefix = this.currentParser.getSchnackId() + ".";
            return prefix + rawName;
        },
        /** checks if the given var name is valid */
        checkVarName: function (rawName) {
            return rawName.match(MATCH_NAME);
        },
    };
});
//     return SchnackInterpreter;
//
// });
//# sourceMappingURL=SchnackInterpreter.js.map