define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.parseEDF = exports.UnlinkedEDF = exports.UnlinkedEDFEntry = exports.EDFEntryType = void 0;
    var EDFEntryType;
    (function (EDFEntryType) {
        EDFEntryType[EDFEntryType["UNSET"] = 0] = "UNSET";
        EDFEntryType[EDFEntryType["REQUIRE"] = 1] = "REQUIRE";
        EDFEntryType[EDFEntryType["ENTITY"] = 2] = "ENTITY";
        EDFEntryType[EDFEntryType["INSTANCE_ENTITY"] = 3] = "INSTANCE_ENTITY";
        EDFEntryType[EDFEntryType["GLOBAL_PROPS"] = 4] = "GLOBAL_PROPS";
        EDFEntryType[EDFEntryType["PROPERTY_GROUP"] = 5] = "PROPERTY_GROUP";
    })(EDFEntryType = exports.EDFEntryType || (exports.EDFEntryType = {}));
    var UnlinkedEDFEntry = /** @class */ (function () {
        function UnlinkedEDFEntry() {
            this.properties = {};
            this.components = [];
            this.propertyGroups = [];
            this.entryType = EDFEntryType.UNSET;
            this.name = "";
            this.parent = "";
        }
        return UnlinkedEDFEntry;
    }());
    exports.UnlinkedEDFEntry = UnlinkedEDFEntry;
    var UnlinkedEDF = /** @class */ (function () {
        function UnlinkedEDF() {
            this.entries = [];
            this.required = null;
            this.hasErrors = false;
        }
        return UnlinkedEDF;
    }());
    exports.UnlinkedEDF = UnlinkedEDF;
    /**
     * Reads *.edf files and created EntityDefinition objects out of it
     */
    function parseEDF(content) {
        var ParseState;
        (function (ParseState) {
            ParseState[ParseState["WAIT_FOR_ELEMENT"] = 0] = "WAIT_FOR_ELEMENT";
            ParseState[ParseState["IN_ELEMENT"] = 1] = "IN_ELEMENT";
            ParseState[ParseState["IN_ELEMENT_COMPONENTS"] = 2] = "IN_ELEMENT_COMPONENTS";
            ParseState[ParseState["IN_ELEMENT_PROPERTIES"] = 3] = "IN_ELEMENT_PROPERTIES";
        })(ParseState || (ParseState = {}));
        var out = new UnlinkedEDF();
        var state = ParseState.WAIT_FOR_ELEMENT;
        var current = null;
        var regHeader = /\[([!|*|\$])?(\w+)(?:\((\w+)\))?(?:\:([\w+\,]+))?]/;
        var regObjectProp = /^(\w|_)*\s*{$/;
        var regArrayProp = /^(\w|_)*\s*\[$/;
        var regMultiStringProp = /^(\w|_)*\s*\"$/;
        var regProp = /^(\w|_)*\s*=/;
        var lines = content.split('\n');
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            var lineTrimmed = line.trim();
            if (!lineTrimmed)
                continue;
            var first = lineTrimmed[0];
            if (first == '#')
                continue;
            var last = lineTrimmed[lineTrimmed.length - 1];
            if (lineTrimmed.length <= 1) {
                if (current != null) {
                    out.hasErrors = true;
                }
                console.error("Unexpected content in line:", i + 1, ":", line);
                continue;
            }
            if (state == ParseState.IN_ELEMENT_COMPONENTS) {
                if (first == '@') {
                    current.components.push(lineTrimmed.substring(1));
                }
                else if (first == '[') {
                    current = null;
                    state = ParseState.WAIT_FOR_ELEMENT;
                }
                else {
                    state = ParseState.IN_ELEMENT_PROPERTIES;
                }
            }
            if (state == ParseState.IN_ELEMENT_PROPERTIES) {
                if (first == '@') {
                    if (current != null) {
                        out.hasErrors = true;
                    }
                    console.error("Unexpected component in property list. Line:", i + 1, ":", line);
                    continue;
                }
                else if (first == '[') {
                    current = null;
                    state = ParseState.WAIT_FOR_ELEMENT;
                }
                else if (current.entryType == EDFEntryType.REQUIRE) {
                    current.components.push(lineTrimmed);
                }
                else {
                    var seekMultiLine = false;
                    var multiLineTerminator = "";
                    if (regProp.test(lineTrimmed)) { // Key&value
                        var pair = lineTrimmed.split('=', 2);
                        if (!pair[0]) {
                            out.hasErrors = true;
                            console.error("Property name cannot be empty. Line:", i + 1, ":", line);
                            continue;
                        }
                        else {
                            current.properties[pair[0].trim()] = pair[1].trim();
                        }
                    }
                    else if (regArrayProp.test(lineTrimmed)) { // multiline-json-array
                        seekMultiLine = true;
                        multiLineTerminator = "]";
                    }
                    else if (regMultiStringProp.test(lineTrimmed)) { // multiline-string
                        seekMultiLine = true;
                        multiLineTerminator = "\"";
                    }
                    else if (regObjectProp.test(lineTrimmed)) { // multiline-json-object
                        seekMultiLine = true;
                        multiLineTerminator = "}";
                    }
                    else {
                        console.error("Cannot parse property. Line:", i + 1, ":", line);
                        continue;
                    }
                    if (seekMultiLine) {
                        var startLineIndex = i;
                        var startLineStr = line;
                        i++;
                        var foundTerminator = false;
                        var multiLineVal = "";
                        for (; i < lines.length; i++) {
                            var scanLine = lines[i];
                            var scanLineTrimmed = scanLine.trim();
                            if (scanLineTrimmed == multiLineTerminator) {
                                foundTerminator = true;
                                break;
                            }
                            multiLineVal += scanLine + "\n";
                        }
                        if (!foundTerminator) {
                            console.error("EOF: Multiline property never closes. Missing " + multiLineTerminator + ". Line:", startLineIndex + 1, ":", startLineStr);
                            out.hasErrors = true;
                            continue;
                        }
                        else {
                            var multiLineKey = lineTrimmed.substring(0, lineTrimmed.length - 1).trim();
                            switch (multiLineTerminator) {
                                case ']':
                                    current.properties[multiLineKey] = "[ " + multiLineVal + " ]";
                                    break;
                                case '}':
                                    current.properties[multiLineKey] = "{ " + multiLineVal + " }";
                                    break;
                                case '"':
                                    current.properties[multiLineKey] = "" + multiLineVal.substring(0, multiLineVal.length - 1);
                                    break;
                            }
                            continue;
                        }
                    }
                }
            }
            if (state == ParseState.WAIT_FOR_ELEMENT) {
                if (first != '[' || last != ']') {
                    console.error("Unexpected content. Line:", i + 1, ":", line);
                    out.hasErrors = true;
                    continue;
                }
                else if (lineTrimmed == "[*]") {
                    current = new UnlinkedEDFEntry();
                    current.entryType = EDFEntryType.GLOBAL_PROPS;
                    state = ParseState.IN_ELEMENT_PROPERTIES;
                    out.entries.push(current);
                }
                else if (lineTrimmed == "[$require]") {
                    if (out.required) {
                        console.error("Unexpected second [$require] entry. Line:", i + 1, ":", line);
                        out.hasErrors = true;
                        continue;
                    }
                    current = new UnlinkedEDFEntry();
                    current.entryType = EDFEntryType.REQUIRE;
                    out.required = current;
                    state = ParseState.IN_ELEMENT_PROPERTIES;
                }
                else {
                    var regResult = regHeader.exec(lineTrimmed);
                    if (!regResult) {
                        console.error("Cannot parse. Line:", i + 1, ":", line);
                        continue;
                    }
                    current = new UnlinkedEDFEntry();
                    var typeInfo = regResult[1];
                    var name_1 = regResult[2];
                    var parent_1 = regResult[3];
                    var propGroups = regResult[4];
                    current.name = name_1;
                    current.entryType = EDFEntryType.ENTITY;
                    switch (typeInfo) {
                        case "$":
                            console.error("Unexpected '$' in line {0}. Use '$' only with [$require]. Line", i + 1, ":", line);
                            out.hasErrors = true;
                            break;
                        case "!":
                            current.entryType = EDFEntryType.INSTANCE_ENTITY;
                            state = ParseState.IN_ELEMENT_COMPONENTS;
                            break;
                        case "*":
                            current.entryType = EDFEntryType.PROPERTY_GROUP;
                            state = ParseState.IN_ELEMENT_PROPERTIES;
                            break;
                        default:
                            state = ParseState.IN_ELEMENT_COMPONENTS;
                            break;
                    }
                    if (parent_1) {
                        if (current.entryType == EDFEntryType.PROPERTY_GROUP) {
                            console.error("PropertyGroups cannot have parents. Line", i + 1, ":", line);
                        }
                        else {
                            state = ParseState.IN_ELEMENT_PROPERTIES;
                            current.parent = parent_1;
                        }
                    }
                    if (propGroups) {
                        var parts = propGroups.split(",");
                        for (var c = 0; c < parts.length; c++) {
                            var part = parts[c];
                            var partTrimmed = part ? part.trim() : "";
                            if (partTrimmed) {
                                current.propertyGroups.push(partTrimmed);
                            }
                        }
                    }
                    out.entries.push(current);
                }
            }
        }
        return out;
    }
    exports.parseEDF = parseEDF;
});
//# sourceMappingURL=EDFParser.js.map