/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2013, Christoph Schnackenberg <bluechs@gmx.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 */
import {Particle} from "@ttjs/engine/2d/flint/Particle";
import {ParticleFactory} from "@ttjs/engine/2d/flint/ParticleFactory";
import {Emitter} from "@ttjs/engine/2d/flint/Emitter";
import {Accelerate} from "@ttjs/engine/2d/flint/actions/Accelerate";
import {Age} from "@ttjs/engine/2d/flint/actions/Age";
import {Fade} from "@ttjs/engine/2d/flint/actions/Fade";
import {Friction} from "@ttjs/engine/2d/flint/actions/Friction";
import {Move} from "@ttjs/engine/2d/flint/actions/Move";
import {RandomDrift} from "@ttjs/engine/2d/flint/actions/RandomDrift";
import {Rotate} from "@ttjs/engine/2d/flint/actions/Rotate";
import {SortY} from "@ttjs/engine/2d/flint/actions/SortY";
import {TargetScale} from "@ttjs/engine/2d/flint/actions/TargetScale";
import {TargetVelocity} from "@ttjs/engine/2d/flint/actions/TargetVelocity";
import {Alpha} from "@ttjs/engine/2d/flint/initializer/Alpha";
import {BitmapAnimation} from "@ttjs/engine/2d/flint/initializer/BitmapAnimation";
import {LifeTime} from "@ttjs/engine/2d/flint/initializer/LifeTime";
import {Position} from "@ttjs/engine/2d/flint/initializer/Position";
import {Rotation} from "@ttjs/engine/2d/flint/initializer/Rotation";
import {RotationVelocity} from "@ttjs/engine/2d/flint/initializer/RotationVelocity";
import {Scale} from "@ttjs/engine/2d/flint/initializer/Scale";
import {Velocity} from "@ttjs/engine/2d/flint/initializer/Velocity";
import {BlendMode} from "@ttjs/engine/2d/flint/initializer/BlendMode";
import {RectPosition} from "@ttjs/engine/2d/flint/initializer/RectPosition";
import {CirclePosition} from "@ttjs/engine/2d/flint/initializer/CirclePosition";
import {RingBlastPosition} from "@ttjs/engine/2d/flint/initializer/RingBlastPosition";
import {Blast} from "@ttjs/engine/2d/flint/counter/Blast";
import {BlastRandom} from "@ttjs/engine/2d/flint/counter/BlastRandom";
import {Pulse} from "@ttjs/engine/2d/flint/counter/Pulse";
import {Random} from "@ttjs/engine/2d/flint/counter/Random";
import {Steady} from "@ttjs/engine/2d/flint/counter/Steady";


/**
 * Facade pattern to access flint particle engine + ttjs extensions
 **/
export const Flint:any = {
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
        TargetScale: TargetScale,
        TargetVelocity: TargetVelocity,
    },
    Initializer: {
        Alpha:           Alpha,
        BitmapAnimation: BitmapAnimation,
        LifeTime:        LifeTime,
        Position:        Position,
        Rotation:        Rotation,
        RotationVelocity:RotationVelocity,
        Scale:           Scale,
        Velocity:        Velocity,
        BlendMode:       BlendMode,
        RectPosition:    RectPosition,
        CirclePosition:  CirclePosition,
        RingBlastPosition: RingBlastPosition,
    },
    Counter: {
        Blast:         Blast,
        BlastRandom:   BlastRandom,
        Pulse:         Pulse,
        Random:        Random,
        Steady:        Steady
    }
};
