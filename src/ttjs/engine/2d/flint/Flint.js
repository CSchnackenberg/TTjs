/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2013, Christoph Schnackenberg <bluechs@gmx.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 * 
 */
define([ 
    'ttjs/engine/2d/flint/Particle',
    'ttjs/engine/2d/flint/ParticleFactory',
    'ttjs/engine/2d/flint/Counter',
    'ttjs/engine/2d/flint/Emitter',
    'ttjs/engine/2d/flint/actions/Accelerate',
    'ttjs/engine/2d/flint/actions/Age',
    'ttjs/engine/2d/flint/actions/Fade',
    'ttjs/engine/2d/flint/actions/Friction',
    'ttjs/engine/2d/flint/actions/Move',
    'ttjs/engine/2d/flint/actions/RandomDrift',
    'ttjs/engine/2d/flint/actions/Rotate',
    'ttjs/engine/2d/flint/actions/SortY',
    'ttjs/engine/2d/flint/actions/TargetScale',
], function(
    Particle,
    ParticleFactory,
    Counter,
    Emitter,
    Accelerate,
    Age,
    Fade,
    Friction,
    Move,
    RandomDrift,
    Rotate,
    SortY,
    TargetScale
)
{    
	"use strict";
    
    /**
     * Facade pattern to access flint particle engine
     **/
    var Flint = {
        Particle: Particle,
        ParticleFactory: ParticleFactory,
        Counter: Counter,
        Emitter: Emitter,
        Actions: {
            Accelerate:  Accelerate,
            Age:         Age,
            Fade:        Fade,
            Friction:    Friction,
            Move:        Move,
            RandomDrift: RandomDrift,
            Rotate:      Rotate,
            SortY:       SortY,
            TargetScale: TargetScale
        }
    };
    
    return Flint;
});