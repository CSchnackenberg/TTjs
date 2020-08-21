/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2013, Christoph Schnackenberg <bluechs@gmx.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 */
define(["require", "exports", "@ttjs/engine/2d/flint/Particle", "@ttjs/engine/2d/flint/ParticleFactory", "@ttjs/engine/2d/flint/Emitter", "@ttjs/engine/2d/flint/actions/Accelerate", "@ttjs/engine/2d/flint/actions/Age", "@ttjs/engine/2d/flint/actions/Fade", "@ttjs/engine/2d/flint/actions/Friction", "@ttjs/engine/2d/flint/actions/Move", "@ttjs/engine/2d/flint/actions/RandomDrift", "@ttjs/engine/2d/flint/actions/Rotate", "@ttjs/engine/2d/flint/actions/SortY", "@ttjs/engine/2d/flint/actions/TargetScale", "@ttjs/engine/2d/flint/actions/TargetVelocity", "@ttjs/engine/2d/flint/initializer/Alpha", "@ttjs/engine/2d/flint/initializer/BitmapAnimation", "@ttjs/engine/2d/flint/initializer/LifeTime", "@ttjs/engine/2d/flint/initializer/Position", "@ttjs/engine/2d/flint/initializer/Rotation", "@ttjs/engine/2d/flint/initializer/RotationVelocity", "@ttjs/engine/2d/flint/initializer/Scale", "@ttjs/engine/2d/flint/initializer/Velocity", "@ttjs/engine/2d/flint/initializer/BlendMode", "@ttjs/engine/2d/flint/initializer/RectPosition", "@ttjs/engine/2d/flint/initializer/CirclePosition", "@ttjs/engine/2d/flint/initializer/RingBlastPosition", "@ttjs/engine/2d/flint/counter/Blast", "@ttjs/engine/2d/flint/counter/BlastRandom", "@ttjs/engine/2d/flint/counter/Pulse", "@ttjs/engine/2d/flint/counter/Random", "@ttjs/engine/2d/flint/counter/Steady"], function (require, exports, Particle_1, ParticleFactory_1, Emitter_1, Accelerate_1, Age_1, Fade_1, Friction_1, Move_1, RandomDrift_1, Rotate_1, SortY_1, TargetScale_1, TargetVelocity_1, Alpha_1, BitmapAnimation_1, LifeTime_1, Position_1, Rotation_1, RotationVelocity_1, Scale_1, Velocity_1, BlendMode_1, RectPosition_1, CirclePosition_1, RingBlastPosition_1, Blast_1, BlastRandom_1, Pulse_1, Random_1, Steady_1) {
    // define([
    //     'ttjs/engine/2d/flint/Particle',
    //     'ttjs/engine/2d/flint/ParticleFactory',
    //     'ttjs/engine/2d/flint/Emitter',
    //
    //     'ttjs/engine/2d/flint/actions/Accelerate',
    //     'ttjs/engine/2d/flint/actions/Age',
    //     'ttjs/engine/2d/flint/actions/Fade',
    //     'ttjs/engine/2d/flint/actions/Friction',
    //     'ttjs/engine/2d/flint/actions/Move',
    //     'ttjs/engine/2d/flint/actions/RandomDrift',
    //     'ttjs/engine/2d/flint/actions/Rotate',
    //     'ttjs/engine/2d/flint/actions/SortY',
    //     'ttjs/engine/2d/flint/actions/TargetScale',
    //     'ttjs/engine/2d/flint/actions/TargetVelocity',
    //
    //     'ttjs/engine/2d/flint/initializer/Alpha',
    //     'ttjs/engine/2d/flint/initializer/BitmapAnimation',
    //     'ttjs/engine/2d/flint/initializer/LifeTime',
    //     'ttjs/engine/2d/flint/initializer/Position',
    //     'ttjs/engine/2d/flint/initializer/Rotation',
    //     'ttjs/engine/2d/flint/initializer/RotationVelocity',
    //     'ttjs/engine/2d/flint/initializer/Scale',
    //     'ttjs/engine/2d/flint/initializer/Velocity',
    //     'ttjs/engine/2d/flint/initializer/BlendMode',
    //     'ttjs/engine/2d/flint/initializer/RectPosition',
    //     'ttjs/engine/2d/flint/initializer/CirclePosition',
    //     'ttjs/engine/2d/flint/initializer/RingBlastPosition',
    //
    //     'ttjs/engine/2d/flint/counter/Blast',
    //     'ttjs/engine/2d/flint/counter/BlastRandom',
    //     'ttjs/engine/2d/flint/counter/Pulse',
    //     'ttjs/engine/2d/flint/counter/Random',
    //     'ttjs/engine/2d/flint/counter/Steady',
    //
    // ], function(
    //     Particle,
    //     ParticleFactory,
    //     Emitter,
    //
    //     Accelerate,
    //     Age,
    //     Fade,
    //     Friction,
    //     Move,
    //     RandomDrift,
    //     Rotate,
    //     SortY,
    //     TargetScale,
    //     TargetVelocity,
    //
    //     Alpha,
    //     BitmapAnimation,
    //     LifeTime,
    //     Position,
    //     Rotation,
    //     RotationVelocity,
    //     Scale,
    //     Velocity,
    //     BlendMode,
    //     RectPosition,
    //     CirclePosition,
    //     RingBlastPosition,
    //
    //     Blast,
    //     BlastRandom,
    //     Pulse,
    //     Random,
    //     Steady,
    //
    //     Flint,
    // ) {
    "use strict";
    exports.__esModule = true;
    exports.Flint = void 0;
    /**
     * Facade pattern to access flint particle engine + ttjs extensions
     **/
    exports.Flint = {
        Particle: Particle_1.Particle,
        ParticleFactory: ParticleFactory_1.ParticleFactory,
        Emitter: Emitter_1.Emitter,
        Actions: {
            Accelerate: Accelerate_1.Accelerate,
            Age: Age_1.Age,
            Fade: Fade_1.Fade,
            Friction: Friction_1.Friction,
            Move: Move_1.Move,
            RandomDrift: RandomDrift_1.RandomDrift,
            Rotate: Rotate_1.Rotate,
            SortY: SortY_1.SortY,
            TargetScale: TargetScale_1.TargetScale,
            TargetVelocity: TargetVelocity_1.TargetVelocity,
        },
        Initializer: {
            Alpha: Alpha_1.Alpha,
            BitmapAnimation: BitmapAnimation_1.BitmapAnimation,
            LifeTime: LifeTime_1.LifeTime,
            Position: Position_1.Position,
            Rotation: Rotation_1.Rotation,
            RotationVelocity: RotationVelocity_1.RotationVelocity,
            Scale: Scale_1.Scale,
            Velocity: Velocity_1.Velocity,
            BlendMode: BlendMode_1.BlendMode,
            RectPosition: RectPosition_1.RectPosition,
            CirclePosition: CirclePosition_1.CirclePosition,
            RingBlastPosition: RingBlastPosition_1.RingBlastPosition,
        },
        Counter: {
            Blast: Blast_1.Blast,
            BlastRandom: BlastRandom_1.BlastRandom,
            Pulse: Pulse_1.Pulse,
            Random: Random_1.Random,
            Steady: Steady_1.Steady
        }
    };
});
//     return Flint;
// });
//# sourceMappingURL=Flint.js.map