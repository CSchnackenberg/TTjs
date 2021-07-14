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


/**
 * A switchable variable between string and number.
 *
 * We still need this class in JavaScript as we can have a double meaning of null
 * otherwise.
 */
export function SchnackVarValue(value) {
    this.str = "";
    this.num = 0;
    this.type = SchnackVarValue.VAR_STRING;
    if (value || value === 0)
        this.setValue(value)
}

// -----------------------------------------------------

let state = 0;
/** variable exists during the entire game */
SchnackVarValue.VAR_NUMBER = state++;
/** variable exists during the current map */
SchnackVarValue.VAR_STRING = state++;

// -----------------------------------------------------

SchnackVarValue.prototype = {
    _num: function(numVal) {
        if (typeof numVal != "number")
            console.error("error! no number!");
        this.num = numVal;
    },
    _str: function(strVal) {
        if (typeof strVal != "string")
            console.error("error! no string!");
        this.str = strVal;
    },
    _convertToNumber: function(num) {
        this._num(num);
        this.str = "";
        this.type = SchnackVarValue.VAR_NUMBER;
    },
    /**
     * NOTE:
     * In case of a string this function tries to parse the value
     * from string to number.
     *
     * setValue(0)   => number
     * setValue("0") => number
     * setValue("a") => string
     *
     * @param v handles: strings, numbers and SchnackVarValue instances.
     */
    setValue: function (v) {
        const t = typeof v;
        if (t == "string") {
            const parsedValue = Number(v);
            // @ts-ignore
            if (Number.isNaN(parsedValue)) {
                this.type = SchnackVarValue.VAR_STRING;
                this._num(0);
                this._str(v);
            }
            else {
                this._num(parsedValue);
                this._str("");
                this.type = SchnackVarValue.VAR_NUMBER;
            }
        }
        else if (t == "number") {

            this._str("");
            this._num(v);
            this.type = SchnackVarValue.VAR_NUMBER;
        }
        else if (t == "object" && v instanceof SchnackVarValue) {
            // @ts-ignore
            this.num = v.num;
            // @ts-ignore
            this.str = v.str;
            // @ts-ignore
            this.type = v.type;
        }
        else if (!v) {
            this._num(0);
            this._str("");
            this.type = SchnackVarValue.VAR_STRING;
        }
        else {
            console.error("SchnackVarValue.setValue() incompatible type:", t, "with value", v);
        }
    },
    /**
     * Sets the value without trying to parse numbers.
     *
     * setValue(0)   => number
     * setValue("0") => string
     * setValue("a") => string
     *
     * @param v handles strings, numbers and SchnackVarValue instances.
     */
    setValueNoParse: function (v) {
        const t = typeof v;
        if (t == "string") {
            this.type = SchnackVarValue.VAR_STRING;
            this._num(0);
            this._str(v);
        }
        else {
            this.setValue(v);
        }
    },
    /**
     * Changes the type to "string" and only accepts a string for a value
     */
    setAsString: function(strValue) {
        console.warn("setAsString() don't use! Use setValueNoParse instead");
        this.setValueNoParse(strValue);
    },
    /**
     * Changes the type to "string" and only accepts a string for a value
     */
    setAsNumber: function(numValue) {
        console.warn("setAsNumber() don't use! Use setValueNoParse instead");
        this.setValueNoParse(numValue);
    },
    /**
     * true if they are equal
     *
     * if typeCheck is false the comparsion does not consider the types
     */
    equals: function (sv, typeCheck = false) {
        if (typeCheck && this.type != sv.type) {
            return false;
        }
        return this.getAsString() == sv.getAsString();
    },

    /**
     * true if they are equal
     *
     * if typeCheck is false the comparsion does not consider the types
     */
    compare: function (sv) {
        if (this.type != sv.type) {
            return this.getAsString().localeCompare(sv.getAsString());
        }
        if (this.isNumber()) {
            if (this.num < sv.num)
                return -1;
            else if (this.num > sv.num)
                return 1;
            return 0;
        }
        return this.str.localeCompare(sv.str); // string
    },
    increment: function() {
        if (this.type == SchnackVarValue.VAR_NUMBER)
            this.num++;
        else
            this._convertToNumber(1);
    },
    incrementBy: function(sv) {
        if (sv instanceof SchnackVarValue) {
            // @ts-ignore
            const numVal = sv.getAsNumber();
            if (this.type == SchnackVarValue.VAR_NUMBER)
                this.num += numVal;
            else
                this._convertToNumber(numVal);
        }
        else {
            const t = typeof sv;
            if (t == "number") {
                if (this.type == SchnackVarValue.VAR_NUMBER)
                    this.num += sv;
                else
                    this._convertToNumber(sv);
            }
            else {
                const val = new SchnackVarValue(sv);
                this.incrementBy(val);
            }
        }

    },
    decrement: function() {
        if (this.type == SchnackVarValue.VAR_NUMBER)
            this.num--;
        else
            this._convertToNumber(-1);
    },
    decrementBy: function(sv) {
        if (sv instanceof SchnackVarValue) {
            // @ts-ignore
            const numVal = sv.getAsNumber();
            if (this.type == SchnackVarValue.VAR_NUMBER)
                this.num -= numVal;
            else
                this._convertToNumber(-numVal);
        }
        else {
            const t = typeof sv;
            if (t == "number") {
                if (this.type == SchnackVarValue.VAR_NUMBER)
                    this.num -= sv;
                else
                    this._convertToNumber(-sv);
            }
            else {
                const val = new SchnackVarValue(sv);
                this.decrementBy(val);
            }
        }
    },
    concat: function(sv) {
        if (sv instanceof SchnackVarValue) {
            if (this.type == SchnackVarValue.VAR_NUMBER) {
                // @ts-ignore
                this._str(this.getAsString() + sv.getAsString());
                this._num(0);
                this.type = SchnackVarValue.VAR_STRING;
            }
            else {
                // @ts-ignore
                this._str(this.str + sv.getAsString());
            }
        }
        else {
            const type = typeof sv;
            if (type == "string") {
                if (this.type == SchnackVarValue.VAR_NUMBER) {
                    this._str(this.getAsString() + sv);
                    this._num(0);
                    this.type = SchnackVarValue.VAR_STRING;
                }
                else {
                    this.str += sv;
                }
            }
        }
    },
    /** resets the data to zero, type is unchanged */
    setEmpty: function() {
        this.str = "";
        this.num = 0;
    },
    /**
     * compare with: SchnackVarValue.VAR_STRING or SchnackVarValue.VAR_NUMBER
     */
    getType: function() {
        return this.type;
    },
    dumpString: function() {
        let out = "";
        if (this.isString()) {
            out += "[string:\"" + this.getAsString() + "\"]";
            //@out.Append("[string:\"").Append(strValue).Append("\"]");
        }
        else {
            out += "[number:\"" + this.getAsString() + "\"]";
        }
        return out;
    },
    /** true if the value is a string */
    isString: function() {
        return this.type == SchnackVarValue.VAR_STRING;
    },
    /** true if the value is a string */
    isNumber: function() {
        return this.type == SchnackVarValue.VAR_NUMBER;
    },
    /** returns the numeric value. If its a string 0 is returned */
    getAsNumber: function() {
        return this.type == SchnackVarValue.VAR_NUMBER ? this.num : 0;
    },
    /** returns the numeric value floored (intish). If its a string 0 is returned */
    getAsInt: function() {
        return Math.floor(this.getAsNumber());
    },
    /** returns string value. If it is a number it'll be converted. */
    getAsString: function() {
        if (this.type == SchnackVarValue.VAR_STRING) {
            return this.str;
        }
        return this.num.toString();
    }

};

