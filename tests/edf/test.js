// SchnackScripts - testing
//
// usage: node test/edf/test
// ---------------------------------------------------------------------------------------------------------------------


//require('amd-loader');
require('amd-loader');
const assert = require('assert');
const fs = require('fs');
const EDFEntryType = require("../../src/ttjs/entity/edf/EDFParser").EDFEntryType;
const parseEDF = require("./../../src/ttjs/entity/edf/EDFParser").parseEDF;
// const EDFLoader = require("./../../src/ttjs/entity/edf/EDFLoader").EDFLoader;



const tests = [];

const debug = false;

// ---------------------------------------------------------------------------------------------------------------------

if (debug) {
    tests.push(["debugging", () => {


    }]);
}

tests.push(["Basic Parsing EDFParser", () => {

const edf1 =
`[*]
c = 3


[Enemy]
@alive
live = 4711

[*pg1]
xx = 23

[Obj1]
@obj1

[Obj2:pg1]
@obj2

[Obj3(Obj1)]

[Obj4(Obj1):pg1]
xx = 12

[!XXX(Obj1)]
name = awesome!

[!YYY(Obj1)]
name =  awesome2  
html " 
  <>  
1
 "
 
[JSON1]
someValA = 0
someVal {
  "bool": true,
  "str": "yes",
  "num": 4711,
  "none": null
}
someValB = 1

 
`;


    const edf1Parsed = parseEDF(edf1);
    console.log(JSON.stringify(edf1Parsed.entries[9], null, 2));

    assert.strictEqual(edf1Parsed.hasErrors, false);
    assert.strictEqual(edf1Parsed.entries[0].entryType, EDFEntryType.GLOBAL_PROPS); // *
    assert.strictEqual(edf1Parsed.entries[1].entryType, EDFEntryType.ENTITY); // Enemy
    assert.strictEqual(edf1Parsed.entries[2].entryType, EDFEntryType.PROPERTY_GROUP); // pg1
    assert.strictEqual(edf1Parsed.entries[3].entryType, EDFEntryType.ENTITY); // Obj1
    assert.strictEqual(edf1Parsed.entries[4].entryType, EDFEntryType.ENTITY); // Obj2
    assert.strictEqual(edf1Parsed.entries[5].entryType, EDFEntryType.ENTITY); // Obj3
    assert.strictEqual(edf1Parsed.entries[6].entryType, EDFEntryType.ENTITY); // Obj4
    assert.strictEqual(edf1Parsed.entries[7].entryType, EDFEntryType.INSTANCE_ENTITY); // XXX
    assert.strictEqual(edf1Parsed.entries[8].entryType, EDFEntryType.INSTANCE_ENTITY); // YYY

    assert.deepStrictEqual(edf1Parsed.entries[1].properties, {
        "live": "4711"
    }); // YYY
    assert.deepStrictEqual(edf1Parsed.entries[6].parent, "Obj1"); // YYY
    assert.deepStrictEqual(edf1Parsed.entries[6].propertyGroups, ["pg1"]);

    assert.deepStrictEqual(edf1Parsed.entries[8].properties, {
        "name": "awesome2",
        "html": "  <>  \n1"
    });

    assert.deepStrictEqual(edf1Parsed.entries[9].properties.someValA, "0");
    assert.deepStrictEqual(edf1Parsed.entries[9].properties.someValB, "1");

    assert.deepStrictEqual(JSON.parse(edf1Parsed.entries[9].properties.someVal), {
        "bool": true,
        "str": "yes",
        "num": 4711,
        "none": null
    });


}]);


// tests.push(["EDFLoader", () => {
//
//     const edf1 =
//         `[$require]
// edf2.ini
//
//
// [*]
// a = 1
// b = 2
//
//
// [FastEnemy(Enemy)]
// live = 15
// a = 22
//
// `;
//
//     const edf2 =
//         `[*]
// c = 3
//
//
// [Enemy]
// @alive
// live = 4711
//
// [*pg1]
// xx = 23
//
// [Obj1]
// @obj1
//
// [Obj2:pg1]
// @obj2
//
// [Obj3(Obj1)]
//
// [Obj4(Obj1):pg1]
// xx = 12
//
// [!XXX(Obj1)]
// name = awesome!
//
// [!YYY(Obj1)]
// name =  awesome2
// html "
//   <>
// 1
//  "
//
// [JSON1]
// someValA = 0
// someVal {
//   "bool": true,
//   "str": "yes",
//   "num": 4711,
//   "none": null
// }
// someValB = 1
//
// `;
//
//
//     const FakeLoader = {
//         readAllText: (url, receiver) => {
//             if (url == "edf1.ini") {
//                 setTimeout(() => {
//                     receiver(true, edf1);
//                 });
//             }
//             else if (url == "edf2.ini") {
//                 setTimeout(() => {
//                     receiver(true, edf2);
//                 });
//             }
//             else {
//                 setTimeout(() => {
//                     receiver(false, "not found");
//                 });
//             }
//         }
//     }
//
//
//     const ee = new EDFLoader(FakeLoader, "edf1.ini", (success, res) => {
//         console.log(res);
//     });
//
//
//
//
// }]);

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





