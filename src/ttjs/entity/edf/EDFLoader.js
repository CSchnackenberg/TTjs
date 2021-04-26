define(["require", "exports", "@ttjs/entity/edf/EDFParser", "@ttjs/entity/EntityDefinition"], function (require, exports, EDFParser_1, EntityDefinition_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EDFLoader = void 0;
    class RawEDFFile {
        constructor() {
            this.unlinkedEDF = null;
            this.errorLoadFile = false;
        }
    }
    class EDFLoader {
        constructor(provider, startEDF, result) {
            this.provider = provider;
            this.startEDF = startEDF;
            this.result = result;
            this.edfMap = {};
            this.pending = [];
            this.definitions = {};
            this.pending.push(startEDF);
            this.loadNextEDF();
        }
        loadNextEDF() {
            while (this.pending.length > 0) {
                const nextEDFFileStr = this.pending.shift();
                if (!this.edfMap[nextEDFFileStr]) {
                    console.log("Loading EDF:", nextEDFFileStr);
                    this.provider.readAllText(nextEDFFileStr, (okay, textOrError) => {
                        const edfData = new RawEDFFile();
                        this.edfMap[nextEDFFileStr] = edfData;
                        edfData.name = nextEDFFileStr;
                        if (!okay) {
                            edfData.errorLoadFile = true;
                            console.error("Failed to load EDF chain. Error loading: ", nextEDFFileStr);
                            this.result(false, this);
                        }
                        else {
                            console.log("Parse EDF:", nextEDFFileStr);
                            edfData.unlinkedEDF = EDFParser_1.parseEDF(textOrError);
                            if (edfData.unlinkedEDF.required &&
                                edfData.unlinkedEDF.required.components.length > 0) {
                                for (let c = 0; c < edfData.unlinkedEDF.required.components.length; c++) {
                                    const requireFile = edfData.unlinkedEDF.required.components[c];
                                    this.pending.push(requireFile);
                                }
                            }
                            this.loadNextEDF();
                        }
                    });
                    return;
                }
            }
            const orderedEDFs = [];
            this.orderDependency(this.startEDF, orderedEDFs);
            this.link(orderedEDFs);
        }
        orderDependency(edfFile, orderedEDFs) {
            if (edfFile == null)
                return;
            const rawEDF = this.edfMap[edfFile];
            if (rawEDF.unlinkedEDF.required && rawEDF.unlinkedEDF.required.components.length > 0) {
                for (let c = 0; c < rawEDF.unlinkedEDF.required.components.length; c++) {
                    const requireFile = rawEDF.unlinkedEDF.required.components[c];
                    this.orderDependency(requireFile, orderedEDFs);
                }
            }
            for (let i = 0; i < rawEDF.unlinkedEDF.entries.length; i++) {
                orderedEDFs.push(rawEDF.unlinkedEDF.entries[i]);
            }
        }
        mergeAWithB(propsA, propsB) {
            const outMap = {};
            const keysOfA = Object.keys(propsA);
            for (let i = 0; i < keysOfA.length; i++) {
                const aKey = keysOfA[i];
                outMap[aKey] = propsB[aKey] || propsA[aKey];
            }
            const keysOfB = Object.keys(propsB);
            for (let i = 0; i < keysOfB.length; i++) {
                const bKey = keysOfB[i];
                outMap[bKey] = propsB[bKey];
            }
            return outMap;
        }
        link(orderedEDFs) {
            let globalProps = {};
            const usedNames = {};
            const consumeName = (name) => {
                if (!name || !name.trim())
                    return false;
                if (usedNames[name])
                    return false;
                usedNames[name] = true;
                return true;
            };
            for (let i = 0; i < orderedEDFs.length; i++) {
                const e = orderedEDFs[i];
                if (e.entryType == EDFParser_1.EDFEntryType.GLOBAL_PROPS) {
                    globalProps = this.mergeAWithB(globalProps, e.properties);
                }
                else if (e.entryType == EDFParser_1.EDFEntryType.PROPERTY_GROUP) {
                    if (!consumeName(e.name)) {
                        console.error("EDF name used more than once:", e.name);
                        continue;
                    }
                    const ed = new EntityDefinition_1.EntityDefinition();
                    ed.name = e.name;
                    ed.type = "property";
                    e.propertyGroups.forEach(pgName => ed.family.push(pgName.toLowerCase()));
                    ed.properties = e.properties;
                    // this.definitions.push(ed);
                    this.definitions[e.name.toLowerCase()] = ed;
                }
                else if (e.entryType == EDFParser_1.EDFEntryType.ENTITY ||
                    e.entryType == EDFParser_1.EDFEntryType.INSTANCE_ENTITY) {
                    if (!consumeName(e.name)) {
                        console.error("EDF name used more than once:", e.name);
                        continue;
                    }
                    const ed = new EntityDefinition_1.EntityDefinition();
                    ed.name = e.name;
                    ed.type = "entity";
                    ed.isStatic = e.entryType == EDFParser_1.EDFEntryType.INSTANCE_ENTITY ? true : false;
                    e.propertyGroups.forEach(pgName => ed.family.push(pgName.toLowerCase()));
                    ed.properties = e.properties;
                    ed.components = e.components;
                    ed.parent = e.parent.toLowerCase();
                    // this.definitions.push(ed);
                    this.definitions[e.name.toLowerCase()] = ed;
                }
            }
            this.result(true, this);
        }
    }
    exports.EDFLoader = EDFLoader;
});
//# sourceMappingURL=EDFLoader.js.map