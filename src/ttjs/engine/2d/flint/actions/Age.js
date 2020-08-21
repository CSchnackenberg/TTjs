define(["require", "exports", "@ttjs/engine/2d/flint/EnergyEasing"], function (require, exports, EnergyEasing_1) {
    "use strict";
    exports.__esModule = true;
    exports.Age = void 0;
    // define([
    //     'ttjs/engine/2d/flint/EnergyEasing'
    // ], function(
    //     EnergyEasing
    // )
    // {
    "use strict";
    function Age(energyEasing) {
        this._easingFunc = energyEasing || EnergyEasing_1.EnergyEasing.Linear.easeNone;
    }
    exports.Age = Age;
    ;
    Age.prototype = {
        update: function (emitter, p, time) {
            p.age += time;
            if (p.age >= p.lifetime) {
                p.energy = 0;
                p.isDead = true;
            }
            else {
                p.energy = this._easingFunc(p.age, p.lifetime);
            }
        }
    };
});
//     return Age;
// });
//# sourceMappingURL=Age.js.map