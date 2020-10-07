define(["require", "exports", "@ttjs/entity/edf/EDFParser", "@ttjs/entity/EntityDefinition"], function (require, exports, EDFParser_1, EntityDefinition_1) {
    "use strict";
    exports.__esModule = true;
    exports.EDFLoader = void 0;
    var RawEDFFile = /** @class */ (function () {
        function RawEDFFile() {
            this.unlinkedEDF = null;
            this.errorLoadFile = false;
        }
        return RawEDFFile;
    }());
    var EDFLoader = /** @class */ (function () {
        function EDFLoader(provider, startEDF, result) {
            this.provider = provider;
            this.startEDF = startEDF;
            this.result = result;
            this.edfMap = {};
            this.pending = [];
            this.definitions = {};
            this.pending.push(startEDF);
            this.loadNextEDF();
        }
        EDFLoader.prototype.loadNextEDF = function () {
            var _this = this;
            var _loop_1 = function () {
                var nextEDFFileStr = this_1.pending.shift();
                if (!this_1.edfMap[nextEDFFileStr]) {
                    console.log("Loading EDF:", nextEDFFileStr);
                    this_1.provider.readAllText(nextEDFFileStr, function (okay, textOrError) {
                        var edfData = new RawEDFFile();
                        _this.edfMap[nextEDFFileStr] = edfData;
                        edfData.name = nextEDFFileStr;
                        if (!okay) {
                            edfData.errorLoadFile = true;
                            console.error("Failed to load EDF chain. Error loading: ", nextEDFFileStr);
                            _this.result(false, _this);
                        }
                        else {
                            console.log("Parse EDF:", nextEDFFileStr);
                            edfData.unlinkedEDF = EDFParser_1.parseEDF(textOrError);
                            if (edfData.unlinkedEDF.required &&
                                edfData.unlinkedEDF.required.components.length > 0) {
                                for (var c = 0; c < edfData.unlinkedEDF.required.components.length; c++) {
                                    var requireFile = edfData.unlinkedEDF.required.components[c];
                                    _this.pending.push(requireFile);
                                }
                            }
                            _this.loadNextEDF();
                        }
                    });
                    return { value: void 0 };
                }
            };
            var this_1 = this;
            while (this.pending.length > 0) {
                var state_1 = _loop_1();
                if (typeof state_1 === "object")
                    return state_1.value;
            }
            var orderedEDFs = [];
            this.orderDependency(this.startEDF, orderedEDFs);
            this.link(orderedEDFs);
        };
        EDFLoader.prototype.orderDependency = function (edfFile, orderedEDFs) {
            if (edfFile == null)
                return;
            var rawEDF = this.edfMap[edfFile];
            if (rawEDF.unlinkedEDF.required && rawEDF.unlinkedEDF.required.components.length > 0) {
                for (var c = 0; c < rawEDF.unlinkedEDF.required.components.length; c++) {
                    var requireFile = rawEDF.unlinkedEDF.required.components[c];
                    this.orderDependency(requireFile, orderedEDFs);
                }
            }
            for (var i = 0; i < rawEDF.unlinkedEDF.entries.length; i++) {
                orderedEDFs.push(rawEDF.unlinkedEDF.entries[i]);
            }
        };
        EDFLoader.prototype.mergeAWithB = function (propsA, propsB) {
            var outMap = {};
            var keysOfA = Object.keys(propsA);
            for (var i = 0; i < keysOfA.length; i++) {
                var aKey = keysOfA[i];
                outMap[aKey] = propsB[aKey] || propsA[aKey];
            }
            var keysOfB = Object.keys(propsB);
            for (var i = 0; i < keysOfB.length; i++) {
                var bKey = keysOfB[i];
                outMap[bKey] = propsB[bKey];
            }
            return outMap;
        };
        EDFLoader.prototype.link = function (orderedEDFs) {
            var globalProps = {};
            var usedNames = {};
            var consumeName = function (name) {
                if (!name || !name.trim())
                    return false;
                if (usedNames[name])
                    return false;
                usedNames[name] = true;
                return true;
            };
            var _loop_2 = function (i) {
                var e = orderedEDFs[i];
                if (e.entryType == EDFParser_1.EDFEntryType.GLOBAL_PROPS) {
                    globalProps = this_2.mergeAWithB(globalProps, e.properties);
                }
                else if (e.entryType == EDFParser_1.EDFEntryType.PROPERTY_GROUP) {
                    if (!consumeName(e.name)) {
                        console.error("EDF name used more than once:", e.name);
                        return "continue";
                    }
                    var ed_1 = new EntityDefinition_1.EntityDefinition();
                    ed_1.name = e.name;
                    ed_1.type = "property";
                    e.propertyGroups.forEach(function (pgName) { return ed_1.family.push(pgName.toLowerCase()); });
                    ed_1.properties = e.properties;
                    // this.definitions.push(ed);
                    this_2.definitions[e.name.toLowerCase()] = ed_1;
                }
                else if (e.entryType == EDFParser_1.EDFEntryType.ENTITY ||
                    e.entryType == EDFParser_1.EDFEntryType.INSTANCE_ENTITY) {
                    if (!consumeName(e.name)) {
                        console.error("EDF name used more than once:", e.name);
                        return "continue";
                    }
                    var ed_2 = new EntityDefinition_1.EntityDefinition();
                    ed_2.name = e.name;
                    ed_2.type = "entity";
                    ed_2.isStatic = e.entryType == EDFParser_1.EDFEntryType.INSTANCE_ENTITY ? true : false;
                    e.propertyGroups.forEach(function (pgName) { return ed_2.family.push(pgName.toLowerCase()); });
                    ed_2.properties = e.properties;
                    ed_2.components = e.components;
                    ed_2.parent = e.parent.toLowerCase();
                    // this.definitions.push(ed);
                    this_2.definitions[e.name.toLowerCase()] = ed_2;
                }
            };
            var this_2 = this;
            for (var i = 0; i < orderedEDFs.length; i++) {
                _loop_2(i);
            }
            this.result(true, this);
        };
        return EDFLoader;
    }());
    exports.EDFLoader = EDFLoader;
});
//# sourceMappingURL=EDFLoader.js.map