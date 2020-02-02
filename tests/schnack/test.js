// SchnackScripts - testing
//
// usage: node test/schnack/test
// ---------------------------------------------------------------------------------------------------------------------
require('amd-loader');
const assert = require('assert');
const fs = require('fs');
const SchnackChunk = require("./../../src/ttjs/engine/schnack/SchnackChunk");
const SchnackVar = require("./../../src/ttjs/engine/schnack/SchnackVar");
const SchnackVarValue = require("./../../src/ttjs/engine/schnack/SchnackVarValue");
const SchnackParser = require("./../../src/ttjs/engine/schnack/SchnackParser");
const SchnackInterpreter = require("./../../src/ttjs/engine/schnack/SchnackInterpreter");
const SchnackResult = require("./../../src/ttjs/engine/schnack/SchnackResult");
const SchnackFormatParser = require("./../../src/ttjs/engine/schnack/SchnackFormatParser");

const tests = [];

const debug = false;

// ---------------------------------------------------------------------------------------------------------------------

if (debug) {
    tests.push(["debugging", () => {

        const cs1 = `
        [a]
        1
        2
        3
        `;

        iptr.initScriptFromSource("cs1", cs1);
        const sr = iptr.executeScriptStep();
        console.log(sr);

    }]);
}

tests.push(["constructor behavior", () => {

    assert(new SchnackVar().getValue() instanceof SchnackVarValue);
    assert(new SchnackVar("v", "muh").getValue() instanceof SchnackVarValue);
    assert(new SchnackVar("v", "0").getValue() instanceof SchnackVarValue);
    assert(new SchnackVar("v", "").getValue() instanceof SchnackVarValue);

    assert.strictEqual(new SchnackVar("v").getValue().getType(), SchnackVarValue.VAR_STRING);
    assert.strictEqual(new SchnackVar("v", "").getValue().getType(), SchnackVarValue.VAR_STRING);
    assert.strictEqual(new SchnackVar("v", "muh").getValue().getType(), SchnackVarValue.VAR_STRING);
    assert.strictEqual(new SchnackVar("v", "100c").getValue().getType(), SchnackVarValue.VAR_STRING);
    assert.strictEqual(new SchnackVar("v", "100.0c").getValue().getType(), SchnackVarValue.VAR_STRING);

    assert.strictEqual(new SchnackVar("v", "0").getValue().getType(), SchnackVarValue.VAR_NUMBER);
    assert.strictEqual(new SchnackVar("v", ".01").getValue().getType(), SchnackVarValue.VAR_NUMBER);
    assert.strictEqual(new SchnackVar("v", "10").getValue().getType(), SchnackVarValue.VAR_NUMBER);
    assert.strictEqual(new SchnackVar("v", 0).getValue().getType(), SchnackVarValue.VAR_NUMBER);
    assert.strictEqual(new SchnackVar("v", 10).getValue().getType(), SchnackVarValue.VAR_NUMBER);
    assert.strictEqual(new SchnackVar("v", 1).getValue().getType(), SchnackVarValue.VAR_NUMBER);

}]);

tests.push(["operators", () => {
    {
        const v = new SchnackVar("v", 0);
        v.getValue().increment();
        v.getValue().increment();
        v.getValue().decrement();
        assert.strictEqual(v.getValue().getAsInt(), 1);
    }
    {
        const v = new SchnackVar("v", "muh");
        v.getValue().increment();
        assert.strictEqual(v.getValue().getAsInt(), 1);
    }
    {
        const v = new SchnackVar("v", 40);
        v.getValue().incrementBy(new SchnackVarValue(10));
        assert.strictEqual(v.getValue().getAsInt(), 50);
    }
    {
        const v = new SchnackVar("v", 40);
        v.getValue().decrementBy(new SchnackVarValue(10));
        assert.strictEqual(v.getValue().getAsInt(), 30);
    }
    {
        const v = new SchnackVar("v", 40);
        v.getValue().incrementBy(10);
        v.getValue().incrementBy("10");
        assert.strictEqual(v.getValue().getAsInt(), 60);
    }
    {
        const v = new SchnackVar("v", 40);
        v.getValue().decrementBy(10);
        v.getValue().decrementBy("10");
        assert.strictEqual(v.getValue().getAsInt(), 20);
    }
}]);

tests.push(["SchnackParser schnackId", () => {
    assert.strictEqual(new SchnackParser("a/b/c.ini.muh", "xxx").getSchnackId(), "c");
    assert.strictEqual(new SchnackParser("c", "xxx").getSchnackId(), "c");
    assert.strictEqual(new SchnackParser("c.ini", "xxx").getSchnackId(), "c");
    assert.strictEqual(new SchnackParser("Abc", "xxx").getSchnackId(), "abc");
    assert.strictEqual(new SchnackParser("aBc.ss", "xxx").getSchnackId(), "abc");
    assert.strictEqual(new SchnackParser("./abC.ss", "xxx").getSchnackId(), "abc");
}]);


tests.push(["SchnackParser chunk text 1", () => {
    const cs1 = `


    [a]
    b
    `;

    const sp = new SchnackParser("cs1", cs1);
    const c1 = sp.parseNextChunk();
    const c2 = sp.parseNextChunk();
    const c3 = sp.parseNextChunk();
    assert.strictEqual(c1.getType(), SchnackChunk.CHUNK_TEXT);
    assert.strictEqual(c2.getType(), SchnackChunk.CHUNK_END);
    assert.strictEqual(c3.getType(), SchnackChunk.CHUNK_END);

    assert.strictEqual(c1.getTokenCount(), 2);
    assert.strictEqual(c1.getTokenAt(0), "a");
    assert.strictEqual(c1.getTokenAt(1), "b\n");
    assert.strictEqual(c1.getLinePos(), 3);
}]);

tests.push(["SchnackParser chunk text 2", () => {
    const cs1 = `
    [a]
    b
    
    [x]
    y
    `;

    const sp = new SchnackParser("cs1", cs1);
    const c1 = sp.parseNextChunk();
    const c2 = sp.parseNextChunk();
    const c3 = sp.parseNextChunk();
    assert.strictEqual(c1.getType(), SchnackChunk.CHUNK_TEXT);
    assert.strictEqual(c2.getType(), SchnackChunk.CHUNK_END);
    assert.strictEqual(c3.getType(), SchnackChunk.CHUNK_END);

    assert.strictEqual(c1.getTokenCount(), 4);
    assert.strictEqual(c1.getTokenAt(0), "a");
    assert.strictEqual(c1.getTokenAt(1), "b\n");
    assert.strictEqual(c1.getTokenAt(2), "x");
    assert.strictEqual(c1.getTokenAt(3), "y\n");
    assert.strictEqual(c1.getLinePos(), 1);
}]);

tests.push(["SchnackParser chunk text 3", () => {
    const cs1 = `
    # comment
    
    
    [a]
    b
    `;

    const sp = new SchnackParser("cs1", cs1);
    const c1 = sp.parseNextChunk();
    const c2 = sp.parseNextChunk();
    const c3 = sp.parseNextChunk();
    assert.strictEqual(c1.getType(), SchnackChunk.CHUNK_TEXT);
    assert.strictEqual(c2.getType(), SchnackChunk.CHUNK_END);
    assert.strictEqual(c3.getType(), SchnackChunk.CHUNK_END);

    assert.strictEqual(c1.getTokenCount(), 2);
    assert.strictEqual(c1.getTokenAt(0), "a");
    assert.strictEqual(c1.getTokenAt(1), "b\n");
    assert.strictEqual(c1.getLinePos(), 4);
}]);

tests.push(["SchnackParser chunk instr", () => {
    assert.deepStrictEqual(new SchnackParser("cs", "@set muh = 1")
        .parseNextChunk().tokenData, ["@set", "muh", "=", "1"]);
    assert.deepStrictEqual(new SchnackParser("cs", "@set muh ++")
        .parseNextChunk().tokenData, ["@set", "muh", "++"]);
    assert.deepStrictEqual(new SchnackParser("cs", "@message msg")
        .parseNextChunk().tokenData, ["@message", "msg"]);
    assert.deepStrictEqual(new SchnackParser("cs", "@else")
        .parseNextChunk().tokenData, ["@else"]);
    assert.deepStrictEqual(new SchnackParser("cs", "@end")
        .parseNextChunk().tokenData, ["@end"]);
    assert.deepStrictEqual(new SchnackParser("cs", "@endif")
        .parseNextChunk().tokenData, ["@endif"]);
    assert.deepStrictEqual(new SchnackParser("cs", "@if muh == 1")
        .parseNextChunk().tokenData, ["@if", "muh", "==", "1"]);

    assert.deepStrictEqual(new SchnackParser("cs", "@elseif muh < 1")
        .parseNextChunk().tokenData, ["@elseif", "muh", "<", "1"]);

    assert.deepStrictEqual(new SchnackParser("cs", "@if muh == sega muh")
        .parseNextChunk().tokenData, ["@if", "muh", "==", "sega muh"]);

    assert.deepStrictEqual(new SchnackParser("cs", "@set muh = str")
        .parseNextChunk().tokenData, ["@set", "muh", "=", "str"]);
    assert.deepStrictEqual(new SchnackParser("cs", "@set muh = str str2")
        .parseNextChunk().tokenData, ["@set", "muh", "=", "str str2"]);
}]);

tests.push(["SchnackParser chunk instr @select", () => {

    const cs1 = `
        @select
            k1:v1
            k2:v2:2
            k3(c1 > 3):v3
        @endselect
    `;

    const sp = new SchnackParser("cs1", cs1);
    const c1 = sp.parseNextChunk();
    assert.strictEqual(c1.getType(), SchnackChunk.CHUNK_INSTRUCTION);
    assert.deepStrictEqual(c1.tokenData, [
        "@select",
        "k1", "v1",
        "k2", "v2:2",
        "k3(c1 > 3)", "v3",
    ]);
}]);


// ---------------------------------------------------------------------------------------------------------------------

const schnackFileReader = fileName => {
    return fs.readFileSync('./tests/schnack/' + fileName, {encoding:'utf8'});
};
const iptr = new SchnackInterpreter(schnackFileReader);


tests.push(["SchnackInterpreter cs_01", () => {
    iptr.initScript("files/cs_01.ini");
    const sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getAsSchnackText().length, 3);
    assert.strictEqual(sr.getAsSchnackText()[0].personId, "1");
    assert.strictEqual(sr.getAsSchnackText()[0].text, "abc");
    assert.strictEqual(sr.getAsSchnackText()[1].personId, "");
    assert.strictEqual(sr.getAsSchnackText()[1].text, "xyz");
    assert.strictEqual(sr.getAsSchnackText()[2].personId, "2");
    assert.strictEqual(sr.getAsSchnackText()[2].text, "ini");

    const sr2 = iptr.executeScriptStep();
    assert.strictEqual(sr2.getType(), SchnackResult.SCHNACKRES_FINISHED);
}]);

tests.push(["SchnackInterpreter cs_02", () => {
    iptr.initScript("files/cs_02.ini");
    const sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getAsSchnackText().length, 3);
    assert.strictEqual(sr.getAsSchnackText()[0].personId, "1");
    assert.strictEqual(sr.getAsSchnackText()[0].text, "abc");
    assert.strictEqual(sr.getAsSchnackText()[1].personId, "");
    assert.strictEqual(sr.getAsSchnackText()[1].text, "xyz");
    assert.strictEqual(sr.getAsSchnackText()[2].personId, "2");
    assert.strictEqual(sr.getAsSchnackText()[2].text, "ini");

    const sr2 = iptr.executeScriptStep();
    assert.strictEqual(sr2.getType(), SchnackResult.SCHNACKRES_FINISHED);
}]);

tests.push(["SchnackInterpreter cs_03", () => {
    iptr.initScript("files/cs_03.ini");

    let sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_VARCHANGE);
    assert.strictEqual(sr.getResultAsVarChange().oldVarExist, false);
    assert.strictEqual(sr.getResultAsVarChange().newVar.getName(), "cs_03.v1");
    assert.strictEqual(sr.getResultAsVarChange().newVar.getValue().getType(), SchnackVarValue.VAR_STRING);
    assert.strictEqual(sr.getResultAsVarChange().newVar.getValue().getAsString(), "abc");
    assert.strictEqual(sr.getResultAsVarChange().newVar.getValue().getAsNumber(), 0);

    sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_VARCHANGE);
    assert.strictEqual(sr.getResultAsVarChange().oldVarExist, false);
    assert.strictEqual(sr.getResultAsVarChange().newVar.getName(), "cs_03.v2");
    assert.strictEqual(sr.getResultAsVarChange().newVar.getValue().getType(), SchnackVarValue.VAR_NUMBER);
    assert.strictEqual(sr.getResultAsVarChange().newVar.getValue().getAsNumber(), 100);

    sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_VARCHANGE);
    assert.strictEqual(sr.getResultAsVarChange().oldVarExist, true);
    assert.strictEqual(sr.getResultAsVarChange().oldVar.getName(), "cs_03.v2");
    assert.strictEqual(sr.getResultAsVarChange().oldVar.getValue().getType(), SchnackVarValue.VAR_NUMBER);
    assert.strictEqual(sr.getResultAsVarChange().oldVar.getValue().getAsNumber(), 100);
    assert.strictEqual(sr.getResultAsVarChange().newVar.getName(), "cs_03.v2");
    assert.strictEqual(sr.getResultAsVarChange().newVar.getValue().getType(), SchnackVarValue.VAR_STRING);
    assert.strictEqual(sr.getResultAsVarChange().newVar.getValue().getAsString(), "100c");

    const sr2 = iptr.executeScriptStep();
    assert.strictEqual(sr2.getType(), SchnackResult.SCHNACKRES_FINISHED);
}]);

tests.push(["SchnackInterpreter cs_04", () => {
    iptr.initScript("files/cs_04.ini");

    let sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_TEXT);
    assert.strictEqual(sr.getAsSchnackText().length, 1);
    assert.strictEqual(sr.getAsSchnackText()[0].personId, "1");
    assert.strictEqual(sr.getAsSchnackText()[0].text, "abc");

    sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_TEXT);
    assert.strictEqual(sr.getAsSchnackText().length, 1);
    assert.strictEqual(sr.getAsSchnackText()[0].personId, "4");
    assert.strictEqual(sr.getAsSchnackText()[0].text, "xyz");

    const sr2 = iptr.executeScriptStep();
    assert.strictEqual(sr2.getType(), SchnackResult.SCHNACKRES_FINISHED);
}]);


tests.push(["SchnackInterpreter cs_05", () => {
    iptr.initScript("files/cs_05.ini");

    let sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_VARCHANGE);
    assert.strictEqual(sr.getResultAsVarChange().oldVarExist, true);
    assert.strictEqual(sr.getResultAsVarChange().oldVar.getName(), "cs_03.v1");
    assert.strictEqual(sr.getResultAsVarChange().oldVar.getValue().getType(), SchnackVarValue.VAR_STRING);
    assert.strictEqual(sr.getResultAsVarChange().oldVar.getValue().getAsString(), "abc");
    assert.strictEqual(sr.getResultAsVarChange().newVar.getName(), "cs_03.v1");
    assert.strictEqual(sr.getResultAsVarChange().newVar.getValue().getType(), SchnackVarValue.VAR_STRING);
    assert.strictEqual(sr.getResultAsVarChange().newVar.getValue().getAsString(), "xyz");

    sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_TEXT);
    assert.strictEqual(sr.getAsSchnackText().length, 1);
    assert.strictEqual(sr.getAsSchnackText()[0].personId, "2");
    assert.strictEqual(sr.getAsSchnackText()[0].text, "def");

    sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_TEXT);
    assert.strictEqual(sr.getAsSchnackText().length, 1);
    assert.strictEqual(sr.getAsSchnackText()[0].personId, "3");
    assert.strictEqual(sr.getAsSchnackText()[0].text, "hij");

    sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_FINISHED);
}]);


tests.push(["SchnackInterpreter cs_06", () => {
    iptr.initScript("files/cs_06.ini");

    let sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_VARCHANGE);
    assert.strictEqual(sr.getResultAsVarChange().oldVarExist, false);
    assert.strictEqual(sr.getResultAsVarChange().newVar.getName(), "g.v1");
    assert.strictEqual(sr.getResultAsVarChange().newVar.getValue().getType(), SchnackVarValue.VAR_STRING);
    assert.strictEqual(sr.getResultAsVarChange().newVar.getValue().getAsString(), "abc");

    sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_TEXT);
    assert.strictEqual(sr.getAsSchnackText().length, 1);
    assert.strictEqual(sr.getAsSchnackText()[0].personId, "1");
    assert.strictEqual(sr.getAsSchnackText()[0].text, "abc");

    sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_FINISHED);
}]);

tests.push(["SchnackInterpreter cs_07", () => {
    iptr.initScript("files/cs_07.ini");

    let sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_VARCHANGE);
    assert.strictEqual(sr.getResultAsVarChange().oldVarExist, true);
    assert.strictEqual(sr.getResultAsVarChange().oldVar.getName(), "g.v1");
    assert.strictEqual(sr.getResultAsVarChange().oldVar.getValue().getType(), SchnackVarValue.VAR_STRING);
    assert.strictEqual(sr.getResultAsVarChange().oldVar.getValue().getAsString(), "abc");
    assert.strictEqual(sr.getResultAsVarChange().newVar.getName(), "g.v1");
    assert.strictEqual(sr.getResultAsVarChange().newVar.getValue().getType(), SchnackVarValue.VAR_STRING);
    assert.strictEqual(sr.getResultAsVarChange().newVar.getValue().getAsString(), "acdc");

    sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_TEXT);
    assert.strictEqual(sr.getAsSchnackText().length, 1);
    assert.strictEqual(sr.getAsSchnackText()[0].personId, "");
    assert.strictEqual(sr.getAsSchnackText()[0].text, "ddd");

    sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_VARCHANGE);
    assert.strictEqual(sr.getResultAsVarChange().oldVarExist, true);
    assert.strictEqual(sr.getResultAsVarChange().oldVar.getName(), "g.v1");
    assert.strictEqual(sr.getResultAsVarChange().oldVar.getValue().getType(), SchnackVarValue.VAR_STRING);
    assert.strictEqual(sr.getResultAsVarChange().oldVar.getValue().getAsString(), "acdc");
    assert.strictEqual(sr.getResultAsVarChange().newVar.getName(), "g.v1");
    assert.strictEqual(sr.getResultAsVarChange().newVar.getValue().getType(), SchnackVarValue.VAR_STRING);
    assert.strictEqual(sr.getResultAsVarChange().newVar.getValue().getAsString(), "hij");

    sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_FINISHED);
}]);


tests.push(["SchnackInterpreter cs_08", () => {
    iptr.initScript("files/cs_08.ini");

    let sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_VARCHANGE);
    assert.strictEqual(sr.getResultAsVarChange().oldVarExist, true);
    assert.strictEqual(sr.getResultAsVarChange().newVar.getName(), "g.v1");
    assert.strictEqual(sr.getResultAsVarChange().newVar.getValue().getType(), SchnackVarValue.VAR_STRING);
    assert.strictEqual(sr.getResultAsVarChange().newVar.getValue().getAsString(), "acdc");

    sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_TEXT);
    assert.strictEqual(sr.getAsSchnackText().length, 2);
    assert.strictEqual(sr.getAsSchnackText()[0].personId, "");
    assert.strictEqual(sr.getAsSchnackText()[0].text, "ddd");
    assert.strictEqual(sr.getAsSchnackText()[1].personId, "");
    assert.strictEqual(sr.getAsSchnackText()[1].text, "xxx");

    sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_FINISHED);
}]);


tests.push(["SchnackInterpreter cs_09", () => {
    iptr.initScript("files/cs_09.ini");

    let sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_MSG);
    assert.strictEqual(sr.getAsSchnackMessage().length, 5);
    assert.strictEqual(sr.getAsSchnackMessage()[0], "1");
    assert.strictEqual(sr.getAsSchnackMessage()[1], "2");
    assert.strictEqual(sr.getAsSchnackMessage()[2], "3");
    assert.strictEqual(sr.getAsSchnackMessage()[3], "4");
    assert.strictEqual(sr.getAsSchnackMessage()[4], "5");

    sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_MSG);
    assert.strictEqual(sr.getAsSchnackMessage().length, 3);
    assert.strictEqual(sr.getAsSchnackMessage()[0], "a");
    assert.strictEqual(sr.getAsSchnackMessage()[1], "b");
    assert.strictEqual(sr.getAsSchnackMessage()[2], "c");

    sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_MSG);
    assert.strictEqual(sr.getAsSchnackMessage().length, 1);
    assert.strictEqual(sr.getAsSchnackMessage()[0], "d");

    sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_FINISHED);
}]);


tests.push(["SchnackInterpreter cs_10", () => {
    iptr.initScript("files/cs_10.ini");

    let sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_VARCHANGE);
    assert.strictEqual(sr.getResultAsVarChange().newVar.getName(), "cs_10.abc");

    sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_VARCHANGE);
    assert.strictEqual(sr.getResultAsVarChange().newVar.getName(), "cs_10.def");

    sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_VARCHANGE);
    assert.strictEqual(sr.getResultAsVarChange().newVar.getName(), "cs_10.hij");

    sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_VARCHANGE);
    assert.strictEqual(sr.getResultAsVarChange().newVar.getName(), "cs_10.hij_cc");

    sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_VARCHANGE);
    assert.strictEqual(sr.getResultAsVarChange().newVar.getName(), "cs_10.AbCdEfG");

    sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_VARCHANGE);
    assert.strictEqual(sr.getResultAsVarChange().newVar.getName(), "pups.ppaai_hui.x");

    sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_VARCHANGE);
    assert.strictEqual(sr.getResultAsVarChange().newVar.getName(), "cs_10.dd00");

    sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_VARCHANGE);
    assert.strictEqual(sr.getResultAsVarChange().newVar.getName(), "cs_10.dd0123456789");

}]);

tests.push(["SchnackInterpreter cs_11", () => {

    console.log("cs_11 *** NOTE the following error outputs are expected\n<OK ERRORS> -------------------------------");

    for (let i = 1; i <= 12; i++)
    {
        iptr.initScript("files/cs_11.ini");
        iptr.setVar(SchnackVar.SCOPE_SESSION, "s.test", "" + i);
        const sr = iptr.executeScriptStep();
        assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_ERROR);
    }

    console.log("</OK ERRORS> -------------------------------");

}]);

tests.push(["SchnackInterpreter cs_12", () => {
    iptr.initScript("files/cs_12.ini");
    const sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_ERROR);
}]);

tests.push(["SchnackInterpreter cs_13", () => {
    iptr.initScript("files/cs_13.ini");
    const sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_ERROR);
}]);

tests.push(["SchnackInterpreter cs_14", () => {
    iptr.initScript("files/cs_14.ini");
    const sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_ERROR);
}]);

tests.push(["SchnackInterpreter cs_15", () => {
    iptr.initScript("files/cs_15.ini");

    let sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_MSG);
    assert.strictEqual(sr.getAsSchnackMessage().length, 1);
    assert.strictEqual(sr.getAsSchnackMessage()[0], "x");

    sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_UNEXPECTED_END);
}]);

tests.push(["SchnackInterpreter cs_16", () => {
    for (let i = 1; i <= 6; i++) {
        iptr.initScript("files/cs_16.ini");
        iptr.setVar(SchnackVar.SCOPE_SESSION, "s.test", "" + i);
        const sr = iptr.executeScriptStep();
        assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_ERROR);
    }
}]);

tests.push(["SchnackInterpreter cs_17", () => {
    iptr.initScript("files/cs_17.ini");
    for (let i = 1; i <= 8; i++) {
        const cmpStr = "x" + i;
        let sr = iptr.executeScriptStep();
        assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_VARCHANGE);
        const varCmp = sr.getResultAsVarChange().newVar.getName();
        assert.strictEqual(varCmp, "cs_17." + cmpStr);

        sr = iptr.executeScriptStep();
        assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_MSG);
        assert.strictEqual(sr.getAsSchnackMessage().length, 1);
        assert.strictEqual(sr.getAsSchnackMessage()[0], cmpStr);
    }
}]);

tests.push(["SchnackInterpreter cs_18", () => {
    iptr.initScript("files/cs_18.ini");
    let sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_VARCHANGE);
    assert.strictEqual(sr.getResultAsVarChange().newVar.getName(), "cs_18.v1");
    assert.strictEqual(sr.getResultAsVarChange().newVar.getValue().getType(), SchnackVarValue.VAR_NUMBER);
    assert.strictEqual(sr.getResultAsVarChange().newVar.getValue().getAsInt(), 10);

    sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_VARCHANGE);
    assert.strictEqual(sr.getResultAsVarChange().newVar.getName(), "cs_18.v1");
    assert.strictEqual(sr.getResultAsVarChange().newVar.getValue().getType(), SchnackVarValue.VAR_NUMBER);
    assert.strictEqual(sr.getResultAsVarChange().newVar.getValue().getAsInt(), 11);

    sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_VARCHANGE);
    assert.strictEqual(sr.getResultAsVarChange().newVar.getName(), "cs_18.v1");
    assert.strictEqual(sr.getResultAsVarChange().newVar.getValue().getType(), SchnackVarValue.VAR_NUMBER);
    assert.strictEqual(sr.getResultAsVarChange().newVar.getValue().getAsInt(), 10);

    sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_VARCHANGE);
    assert.strictEqual(sr.getResultAsVarChange().newVar.getName(), "cs_18.v1");
    assert.strictEqual(sr.getResultAsVarChange().newVar.getValue().getType(), SchnackVarValue.VAR_NUMBER);
    assert.strictEqual(sr.getResultAsVarChange().newVar.getValue().getAsInt(), 15);

    sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_VARCHANGE);
    assert.strictEqual(sr.getResultAsVarChange().newVar.getName(), "cs_18.v1");
    assert.strictEqual(sr.getResultAsVarChange().newVar.getValue().getType(), SchnackVarValue.VAR_NUMBER);
    assert.strictEqual(sr.getResultAsVarChange().newVar.getValue().getAsInt(), 10);

    sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_VARCHANGE);
    assert.strictEqual(sr.getResultAsVarChange().newVar.getName(), "cs_18.v2");
    assert.strictEqual(sr.getResultAsVarChange().newVar.getValue().getType(), SchnackVarValue.VAR_STRING);
    assert.strictEqual(sr.getResultAsVarChange().newVar.getValue().getAsString(), "abc");

    sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_VARCHANGE);
    assert.strictEqual(sr.getResultAsVarChange().newVar.getName(), "cs_18.v2");
    assert.strictEqual(sr.getResultAsVarChange().newVar.getValue().getType(), SchnackVarValue.VAR_STRING);
    assert.strictEqual(sr.getResultAsVarChange().newVar.getValue().getAsString(), "abc18");

    sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_VARCHANGE);
    assert.strictEqual(sr.getResultAsVarChange().newVar.getName(), "cs_18.v2");
    assert.strictEqual(sr.getResultAsVarChange().newVar.getValue().getType(), SchnackVarValue.VAR_STRING);
    assert.strictEqual(sr.getResultAsVarChange().newVar.getValue().getAsString(), "abc18c");

    sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_VARCHANGE);
    assert.strictEqual(sr.getResultAsVarChange().newVar.getName(), "cs_18.v3");
    assert.strictEqual(sr.getResultAsVarChange().newVar.getValue().getType(), SchnackVarValue.VAR_NUMBER);
    assert.strictEqual(sr.getResultAsVarChange().newVar.getValue().getAsInt(), 1);

    sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_VARCHANGE);
    assert.strictEqual(sr.getResultAsVarChange().newVar.getName(), "cs_18.v4");
    assert.strictEqual(sr.getResultAsVarChange().newVar.getValue().getType(), SchnackVarValue.VAR_NUMBER);
    assert.strictEqual(sr.getResultAsVarChange().newVar.getValue().getAsInt(), -1);

    sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_VARCHANGE);
    assert.strictEqual(sr.getResultAsVarChange().newVar.getName(), "cs_18.v5");
    assert.strictEqual(sr.getResultAsVarChange().newVar.getValue().getType(), SchnackVarValue.VAR_NUMBER);
    assert.strictEqual(sr.getResultAsVarChange().newVar.getValue().getAsInt(), 3);

    sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_VARCHANGE);
    assert.strictEqual(sr.getResultAsVarChange().newVar.getName(), "cs_18.v6");
    assert.strictEqual(sr.getResultAsVarChange().newVar.getValue().getType(), SchnackVarValue.VAR_NUMBER);
    assert.strictEqual(sr.getResultAsVarChange().newVar.getValue().getAsInt(), -3);
}]);


tests.push(["SchnackInterpreter cs_19", () => {

    iptr.initScript("files/cs_19.ini");

    let sr;

    // select 1

    sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_SELECT);
    assert.strictEqual(sr.getResultAsSelect().question, "xxx");
    assert.strictEqual(sr.getResultAsSelect().questionVar, "cs_19.choose_whish");
    assert.strictEqual(Object.keys(sr.getResultAsSelect().answerOptions).length, 3);
    assert.strictEqual(sr.getResultAsSelect().answerOptions["youth"], "yyy");
    assert.strictEqual(sr.getResultAsSelect().answerOptions["hair"], "zzz");
    assert.strictEqual(sr.getResultAsSelect().answerOptions["none"], "www");

    let s1 = "youth";
    iptr.setVar(SchnackVar.SCOPE_SESSION, sr.getResultAsSelect().questionVar, s1);
    iptr.reinitAfterSelection();
    sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_MSG);
    assert.strictEqual(sr.getAsSchnackMessage().length, 1);
    assert.strictEqual(sr.getAsSchnackMessage()[0], "aaa");
    sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_FINISHED);
    iptr.releaseSessionScope();

    // select 2

    iptr.initScript("files/cs_19.ini");
    sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_SELECT);
    assert.strictEqual(sr.getResultAsSelect().question, "xxx");
    assert.strictEqual(sr.getResultAsSelect().questionVar, "cs_19.choose_whish");
    assert.strictEqual(Object.keys(sr.getResultAsSelect().answerOptions).length, 3);
    assert.strictEqual(sr.getResultAsSelect().answerOptions["youth"], "yyy");
    assert.strictEqual(sr.getResultAsSelect().answerOptions["hair"], "zzz");
    assert.strictEqual(sr.getResultAsSelect().answerOptions["none"], "www");

    s1 = "hair";
    iptr.setVar(SchnackVar.SCOPE_SESSION, sr.getResultAsSelect().questionVar, s1);
    iptr.reinitAfterSelection();
    sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_MSG);
    assert.strictEqual(sr.getAsSchnackMessage().length, 1);
    assert.strictEqual(sr.getAsSchnackMessage()[0], "bbb");

    sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_FINISHED);
    iptr.releaseSessionScope();

    // select 3

    iptr.initScript("files/cs_19.ini");
    sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_SELECT);
    assert.strictEqual(sr.getResultAsSelect().question, "xxx");
    assert.strictEqual(sr.getResultAsSelect().questionVar, "cs_19.choose_whish");
    assert.strictEqual(Object.keys(sr.getResultAsSelect().answerOptions).length, 3);
    assert.strictEqual(sr.getResultAsSelect().answerOptions["youth"], "yyy");
    assert.strictEqual(sr.getResultAsSelect().answerOptions["hair"], "zzz");
    assert.strictEqual(sr.getResultAsSelect().answerOptions["none"], "www");

    s1 = "none";
    iptr.setVar(SchnackVar.SCOPE_SESSION, sr.getResultAsSelect().questionVar, s1);
    iptr.reinitAfterSelection();
    sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_MSG);
    assert.strictEqual(sr.getAsSchnackMessage().length, 1);
    assert.strictEqual(sr.getAsSchnackMessage()[0], "ccc");

    sr = iptr.executeScriptStep();
    assert.strictEqual(sr.getType(), SchnackResult.SCHNACKRES_FINISHED);
    iptr.releaseSessionScope();

}]);

// ---------------------------------------------------------------------------------------------------------------------

tests.push(["SchnackFormatParser strip syntax", () => {
    assert.strictEqual(SchnackFormatParser.parse("a{b:xxx{c:yyy}zzz}"), "axxxyyyzzz");
    assert.strictEqual(SchnackFormatParser.parse("a {b:xxx {c:yyy} zzz}"), "a xxx yyy zzz");
    assert.strictEqual(SchnackFormatParser.parse("a  {b:xxx  {c:yyy}  zzz}"), "a  xxx  yyy  zzz");
}]);

tests.push(["SchnackFormatParser data feedback", () => {
    let data = [];
    SchnackFormatParser.parse("a{b:xxx{c:yyy}zzz}", (evt, sym, stack, str, i) => {
        data.push([evt, sym, str]);
    });
    assert.deepStrictEqual(data[0],[SchnackFormatParser.EVENT_START, "b", "a"]);
    assert.deepStrictEqual(data[1],[SchnackFormatParser.EVENT_START, "c", "axxx"]);
    assert.deepStrictEqual(data[2],[SchnackFormatParser.EVENT_END, "c", "axxxyyy"]);
    assert.deepStrictEqual(data[3],[SchnackFormatParser.EVENT_END, "b", "axxxyyyzzz"]);
    assert.strictEqual(data.length, 4);
}]);


// ---------------------------------------------------------------------------------------------------------------------

// run tests
let success = 0;
const num = debug ? 1 : tests.length;
for (let i=0; i<num; i++) {
    const t = tests[i];
    const name = t[0]
    const testFunc = t[1];
    try {
        testFunc();
        success++;
        console.log(`Run test [${i+1}]: ${name}...OK`);
    }
    catch (e) {
        console.log(`Run test [${i+1}]: ${name}...FAILED`);
        console.error(e);
        break;
    }
};

if (success == tests.length) {
    console.log("------------------\n100% passed");
}
else {
    console.log(`-> ${success} passed`);
}





