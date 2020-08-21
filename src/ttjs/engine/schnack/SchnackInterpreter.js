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
import {SchnackParser} from "./SchnackParser";
import {SchnackVar} from "./SchnackVar";
import {SchnackVarValue} from "./SchnackVarValue";
import {SchnackChunk} from "./SchnackChunk";
import {SchnackResult} from "./SchnackResult";
import {SchnackUtil} from "./SchnackUtil";

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

const LEVEL_DEPTH = 8;
const MATCH_NAME = /^[a-zA-Z][a-zA-Z0-9\._]*$/g;

/**
 * Creates a new SchnackInterpreter including a scope etc.
 *
 * @param fileProvider needs to be a function: (file) => {return content}. Must by sync.
 * @constructor
 */
export function SchnackInterpreter(fileProvider) {
    this.currentParser = null;
    this.storage = {};
    this.callScope = 0;
    this.lastFile = "";
    this.lastFileScope = "";
    this.ifLevel = 0;
    this.ifLevelDone = [];
    this.fileProvider = fileProvider;
}

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
        const scopeName = alternativeScopeName || file;

        this.lastFileScope = scopeName;
        this.lastFile = file;
        this.callScope = 0;
        this.ifLevel = 0;
        this.ifLevelDone = [];
        for (let i=0; i<LEVEL_DEPTH; i++)
            this.ifLevelDone.push(false);

        const _code = this.fileProvider(file);
        this.currentParser = new SchnackParser(scopeName, _code);
    },
    /**  executes a script from a string */
    initScriptFromSource: function(pseudoFileName, sourceCode) {
        this.lastFile = "";
        this.callScope = 0;
        this.ifLevel = 0;
        this.ifLevelDone = [];
        for (let i=0; i<LEVEL_DEPTH; i++)
            this.ifLevelDone.push(false);
        this.currentParser = new SchnackParser(pseudoFileName, sourceCode);
    },
    /** call this after a selection */
    reinitAfterSelection: function () {
        if (!this.lastFile)
            return;
        this.initScript(this.lastFile, this.lastFileScope);
    },
    /** executes script-step */
    executeScriptStep: function() {
        if (!this.currentParser) {
            console.error("parse is null");
            return null;
        }

        let chunk = this.currentParser.parseNextChunk();
        while(this.currentParser != null && chunk.getType() != SchnackChunk.CHUNK_END) {
            if (chunk.getType() == SchnackChunk.CHUNK_TEXT)
            {
                const type = SchnackResult.SCHNACKRES_TEXT;
                const data = [];
                for (let i=0; i<chunk.getTokenCount(); i +=2) {
                    data.push({
                        personId: chunk.getTokenAt(i+0),
                        text: chunk.getTokenAt(i+1),
                    });
                }
                return new SchnackResult(data, type);
            }
            else if (chunk.getType() == SchnackChunk.CHUNK_INSTRUCTION) {
                const instrToken = chunk.getTokenAt(0);
                if (chunk.getTokenCount() == 0)
                {
                    console.error("Error parsing script  Invalid token");
                    chunk.logError();
                    return new SchnackResult(null, SchnackResult.SCHNACKRES_ERROR);
                }

                if (instrToken === "@end") {
                    this.currentParser = null;
                    return new SchnackResult(null, SchnackResult.SCHNACKRES_FINISHED);
                }
                else if (instrToken == "@message") {
                    const data = [];
                    for (let i=1; i<chunk.getTokenCount(); i++) {
                        data.push(chunk.getTokenAt(i));
                    }
                    return new SchnackResult(data, SchnackResult.SCHNACKRES_MSG);
                }
                else if (instrToken == "@select") {
                    const data = {};
                    const rawQuestionVarName = chunk.getTokenAt(1);
                    if (!this.checkVarName(rawQuestionVarName)) {
                        console.error("@select invalid character in question-varname");
                        chunk.logError();
                        return new SchnackResult(null, SchnackResult.SCHNACKRES_ERROR);
                    }
                    data.questionVar = this.getVarName(rawQuestionVarName);
                    data.question = chunk.getTokenAt(2);
                    data.answerOptions = {};
                    for (let i=3;i<chunk.getTokenCount(); i += 2) {
                        let insert = true;
                        const varNameOrCondition = chunk.getTokenAt(i+0);
                        let varName = "";
                        let conditionIndex = varNameOrCondition.indexOf('(');
                        if (conditionIndex > 0) {
                            varName = varNameOrCondition.substr(0, conditionIndex);
                            const condition = varNameOrCondition.substr(conditionIndex + 1, varNameOrCondition.length - (conditionIndex + 2));
                            const conditionParts = SchnackUtil.splitTrimmed(condition, ' ', true);

                            const pseudoChunk = new SchnackChunk(SchnackChunk.CHUNK_INSTRUCTION, chunk.getLinePos());
                            pseudoChunk.addToken("@if");
                            pseudoChunk.addToken(conditionParts);

                            if (!this.checkConditionParameter(pseudoChunk)) {
                                console.error("@select invalid condition in select variable: " + condition);
                                chunk.logError();
                                return new SchnackResult(null, SchnackResult.SCHNACKRES_ERROR);
                            }

                            if (!this.checkConditionVarName(pseudoChunk)) {
                                console.error("@select invalid varname in selection condition: " + condition);
                                chunk.logError();
                                return new SchnackResult(null, SchnackResult.SCHNACKRES_ERROR);
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
                            return new SchnackResult(null, SchnackResult.SCHNACKRES_ERROR);
                        }

                        if (insert) {
                            data.answerOptions[varName] = chunk.getTokenAt(i+1);
                        }
                    }

                    this.currentParser = null;
                    return new SchnackResult(data, SchnackResult.SCHNACKRES_SELECT);
                }
                else if (instrToken == "@set") {
                    if (!this.checkSetParameter(chunk) ) {
                        console.error("@set Expects @set <variable> = <value> or @set <variable> ++, -- or @set <variable> +=, -= <value> or @set <variable> .= <value>");
                        chunk.logError();
                        return new SchnackResult(null, SchnackResult.SCHNACKRES_ERROR);
                    }

                    // let's fetch the target variable
                    const rawVarName = chunk.getTokenAt(1);
                    const isOkay = this.checkVarName(rawVarName);
                    if (!isOkay) {
                        console.error("@set invalid varname");
                        chunk.logError();
                        return new SchnackResult(null, SchnackResult.SCHNACKRES_ERROR);
                    }
                    const varName = this.getVarName(rawVarName);
                    const vv = this.storage[varName] || false;
                    const v = new SchnackVarValue(vv ? vv.getValue() : null);
                    const operatorToken = chunk.getTokenAt(2);

                    // perform the operation
                    if (chunk.getTokenCount() == 3) {
                        switch(operatorToken) {
                            case "++":
                                v.increment();
                                break;
                            case "--":
                                v.decrement();
                                break;
                            default:
                                chunk.logError();
                                return new SchnackResult(null, SchnackResult.SCHNACKRES_ERROR);
                        }
                    }
                    else {
                        const varValue = chunk.getTokenAt(3);
                        switch(operatorToken) {
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
                                return new SchnackResult(null, SchnackResult.SCHNACKRES_ERROR);
                        }
                    }

                    // get back data for reporting
                    const scope = this.getScopeByName(varName);
                    const oldVar = vv;
                    const newVar = this.setVar(scope, varName, v);

                    return new SchnackResult({
                        newVar: newVar,
                        oldVar: oldVar,
                        oldVarExist: vv ? true : false,
                    }, SchnackResult.SCHNACKRES_VARCHANGE);
                }
                else if (instrToken == "@if") {
                    if (!this.checkConditionParameter(chunk)) {
                        console.error("@if Expects @if =, !=, >=, <=, <, > <value>");
                        chunk.logError();
                        return new SchnackResult(null, SchnackResult.SCHNACKRES_ERROR);
                    }

                    this.ifLevel++;
                    this.ifLevelDone[this.ifLevel] = false;
                    const varNameOkay = this.checkConditionVarName(chunk);
                    if (!varNameOkay) {
                        console.error("@if invalid varname");
                        chunk.logError();
                        return new SchnackResult(null, SchnackResult.SCHNACKRES_ERROR);
                    }

                    const condition = this.checkCondition(chunk);
                    if (condition) {
                        this.ifLevelDone[this.ifLevel] = true;
                    }
                    else {
                        this.skipTillEndif();
                    }
                }
                else  if (instrToken == "@elseif") {
                    if (this.ifLevel == 0) {
                        console.error("SchnackInterpreter @elseif without if!");
                        chunk.logError();
                        return new SchnackResult(null, SchnackResult.SCHNACKRES_ERROR);
                    }
                    if (!this.checkConditionParameter(chunk)) {
                        console.error("@elseif expects @elseif =, !=, >=, <=, <, > <value>");
                        chunk.logError();
                        return new SchnackResult(null, SchnackResult.SCHNACKRES_ERROR);
                    }
                    if (this.ifLevelDone[this.ifLevel]) {
                        // a previous if/elseif already
                        // fulfilled the condition and was executed
                        // so we can just skip it here.
                        this.skipTillEndif();
                    }
                    else {
                        const varNameOkay = this.checkConditionVarName(chunk);
                        if (!varNameOkay) {
                            console.error("@elseif invalid varname");
                            chunk.logError();
                            return new SchnackResult(null, SchnackResult.SCHNACKRES_ERROR);
                        }
                        const condition = this.checkCondition(chunk);
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
                    if (this.ifLevel == 0)
                    {
                        console.error("SchnackInterpreter @else without if!");
                        chunk.logError();
                        return new SchnackResult(null, SchnackResult.SCHNACKRES_ERROR);
                    }

                    if (this.ifLevelDone[this.ifLevel] == false)
                    {
                        // we are in the elseblock and
                        // until now all previous blocks have
                        // not been able to fulfull the if/elseif
                        // conditions.
                        //
                        // then we can exeicute it now :)
                        this.ifLevelDone[this.ifLevel] = true;
                    }
                    else
                    {
                        // a previous if/elseif already
                        // fulfilled the condition and was executed
                        // so we can just skip it here.
                        this.skipTillEndif();
                    }
                }
                else if (chunk.getTokenAt(0) == "@endif")
                {
                    if (this.ifLevel == 0)
                    {
                        console.error("SchnackInterpreter @endif without if!");
                        chunk.logError();
                        return new SchnackResult(null, SchnackResult.SCHNACKRES_ERROR);
                    }

                    // we are leaving the endif block :)
                    this.ifLevelDone[this.ifLevel] = true;
                    this.ifLevel--;
                }
            }
            chunk = this.currentParser.parseNextChunk();
        }

        if (this.ifLevel > 0)
        {
            console.error("SchnackInterpreter Found unexpected end!");
            return new SchnackResult(null, SchnackResult.SCHNACKRES_UNEXPECTED_END);
        }

        if (chunk.getType() == SchnackChunk.CHUNK_END)
        {
            this.currentParser = null;
            return new SchnackResult(null, SchnackResult.SCHNACKRES_FINISHED);
        }

        // here we actually have an unexpected state :-/
        return new SchnackResult(null, SchnackResult.SCHNACKRES_UNEXPECTED_END);
    },
    /**
     *
     * @returns SchnackVar the created object holding the value
     */
    setVar: function (scope, name, val) {
        const sv = new SchnackVar(name, val);
        sv.setPersistent(true);
        sv.setScope(scope);
        this.storage[name] = sv;
        return sv;
    },
    /**
     * @returns boolean true on success
     */
    removeVar: function(name) {
        if (this.storage[name]) {
            delete this.storage[name];
            return true;
        }
        return false;
    },
    /**
     * @returns {SchnackVar|boolean}
     */
    getVar: function(name) {
        return this.storage[name] || false;
    },
    /**
     * returns a vector with all variables that are
     * flagged as persistant
     */
    getPersistentVars: function() {
        const out = [];
        Object.keys(this.storage).forEach(k => {
            const v = this.storage[k];
            if (v.isPersistent())
                out.push(v);
        });
        return out;
    },
    /** removes all variables that have map-scope. */
    releaseMapScope: function () {
        Object.keys(this.storage).forEach(k => {
            const v = this.storage[k];
            if (v.getScope() == SchnackVar.SCOPE_MAP) {
                delete this.storage[k];
            }
        });
    },
    /** removes all variables that have session-scope. */
    releaseSessionScope: function () {
        Object.keys(this.storage).forEach(k => {
            const v = this.storage[k];
            if (v.getScope() == SchnackVar.SCOPE_SESSION) {
                delete this.storage[k];
            }
        });
    },
    getScopeByName: function(varName) {
        if (varName.startsWith("map.")) {
            return SchnackVar.SCOPE_MAP;
        }
        else if (varName.startsWith("session.")) {
            return SchnackVar.SCOPE_SESSION;
        }
        return SchnackVar.SCOPE_GAME;
    },
    /** checks if the given condition has a valid var name */
    checkConditionVarName: function(condition) {
        const rawVarNameFromScript = condition.getTokenAt(1);
        return this.checkVarName(rawVarNameFromScript);
    },
    /** retruns true if the condition is true */
    checkCondition: function(condition) {

        // fetch left hand var
        const rawVarNameFromScript = condition.getTokenAt(1);
        const varName = this.getVarName(rawVarNameFromScript);
        const potentialVarObj = this.getVar(varName);
        const varObj = potentialVarObj ? potentialVarObj : new SchnackVar(varName, 0);

        // fetch right hand value
        const cmp = new SchnackVarValue(condition.getTokenAt(3));

        // perform condition checking
        const cmpToken = condition.getTokenAt(2);
        switch(cmpToken) {
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
    checkConditionParameter: function(condition) {
        if (condition.getTokenCount() != 4)
            return false;
        const cmpToken = condition.getTokenAt(2);
        switch(cmpToken) {
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
    checkSetParameter: function(setChunk) {
        const tokenCount = setChunk.getTokenCount();
        const operatorToken = setChunk.getTokenAt(2);
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
    skipTillEndif: function() {
        let level = 0;
        let chunk = this.currentParser.parseNextChunk();
        while(chunk.getType() != SchnackChunk.CHUNK_END) {
            if (chunk.getType() == SchnackChunk.CHUNK_INSTRUCTION) {
                const instrToken = chunk.getTokenAt(0);
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
            chunk = this.currentParser.parseNextChunk()
        }
        console.error("SchnackInterpreter() missing @endif");
    },
    /** builds a var name considering the current script context. */
    getVarName: function (rawName) {
        if (!this.checkVarName(rawName))
            console.error("getVarName() invalid name: " + rawName);
        if (rawName.indexOf(".") >= 0)
            return rawName;
        const prefix = this.currentParser.getSchnackId() + ".";
        return prefix + rawName;
    },
    /** checks if the given var name is valid */
    checkVarName: function(rawName) {
        return rawName.match(MATCH_NAME);
    },

};

//     return SchnackInterpreter;
//
// });
