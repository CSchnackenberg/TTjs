/**
 * TODO
 */
define([     
    'ttjs/engine/2d/flint/EnergyEasing'
], function(
    EnergyEasing
)
{
    "use strict";
    var Age = function(energyEasing) {        
        this._easingFunc = energyEasing || EnergyEasing.Linear.easeNone;
    };    

    
    Age.prototype = {
        update: function(emitter, p, time)
        {
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
    
    return Age;
});