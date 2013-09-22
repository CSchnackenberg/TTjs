/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2013, Christoph Schnackenberg <bluechs@gmx.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE 
 */
define([ 
    'ttjs/engine/2d/flint/Particle',
    'ttjs/engine/2d/flint/ParticleFactory',
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
    
    'ttjs/engine/2d/flint/initializer/Alpha',
    'ttjs/engine/2d/flint/initializer/BitmapAnimation',
    'ttjs/engine/2d/flint/initializer/LifeTime',
    'ttjs/engine/2d/flint/initializer/Position',
    'ttjs/engine/2d/flint/initializer/Rotation',
    'ttjs/engine/2d/flint/initializer/RotationVelocity',
    'ttjs/engine/2d/flint/initializer/Scale',
    'ttjs/engine/2d/flint/initializer/Velocity',
    
    'ttjs/engine/2d/flint/counter/Blast',
    'ttjs/engine/2d/flint/counter/BlastRandom',
    'ttjs/engine/2d/flint/counter/Pulse',
    'ttjs/engine/2d/flint/counter/Random',
    'ttjs/engine/2d/flint/counter/Steady',
    
], function(
    Particle,
    ParticleFactory,
    Emitter,
    
    Accelerate,    
    Age,
    Fade,
    Friction,
    Move,
    RandomDrift,
    Rotate,
    SortY,
    TargetScale,
    
    Alpha,
    BitmapAnimation,
    LifeTime,
    Position,
    Rotation,
    RotationVelocity,
    Scale,
    Velocity,
    
    Blast,
    BlastRandom,
    Pulse,
    Random,
    Steady
)
{    
	"use strict";
    
    /**
     * Facade pattern to access flint particle engine
     **/
    var Flint = {
        Particle: Particle,
        ParticleFactory: ParticleFactory,
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
        },
        Initializer: {
            Alpha:           Alpha,
            BitmapAnimation: BitmapAnimation,
            LifeTime:        LifeTime,
            Position:        Position,
            Rotation:        Rotation,
            RotationVelocity:RotationVelocity,
            Scale:           Scale,
            Velocity:        Velocity
        },
        Counter: {
            Blast:         Blast,
            BlastRandom:   BlastRandom,
            Pulse:         Pulse,
            Random:        Random,
            Steady:        Steady
        }
    };
    
    return Flint;
});