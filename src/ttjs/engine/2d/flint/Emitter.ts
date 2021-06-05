/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * ==================================================
 *
 * FLINT PARTICLE SYSTEM
 * .....................
 *
 *
 * Author: Richard Lord
 * Copyright (c) Richard Lord 2008-2011
 * http://flintparticles.org
 *
 *
 * Licence Agreement
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * ==================================================
 *
 * Port to Javascript and modifications:
 *
 * Copyright (c) 2013, Christoph Schnackenberg <bluechs@gmx.de>
 *
 */
import {Particle} from "@ttjs/engine/2d/flint/Particle";
import {ParticleFactory} from "@ttjs/engine/2d/flint/ParticleFactory";



export class Emitter {
    
    public counter:any = null;
    public _factory:ParticleFactory;

    public _started:boolean = false;
    public _running:boolean = false;
    
    public _actions = [];
    public _emitterActions = [];
    public _initializer = [];
    public _particles = [];
    
    public _container:PIXI.Container; // = displayContainer;
    
    constructor(displayContainer:PIXI.Container, factory:ParticleFactory) {
        this._container = displayContainer;
        this._factory = factory;
    }

    addAction(action)
    {
        this._actions.push(action);
        return this;
    }
    addEmitterAction(action)
    {
        this._emitterActions.push(action);
        return this;
    }
    addInitializer(ini)
    {
        this._initializer.push(ini);
        return this;
    }
    pause()
    {
        this._running = false;
    }
    resume()
    {
        this._running = true;
    }
    start()
    {
        if (!this.counter)
        {
            console.error("An emitter requires a counter");
            return;
        }

        if (this._started)
            return;

        this._started = true;
        this._running = true;

        var len = this._emitterActions.length;
        for (var i=0; i<len; i++) {
            this._emitterActions[i].init(this);
        }

        var startParticleCount = this.counter.startEmitter(this);
        for(var i=0; i<startParticleCount; i++)
            this._createParticle();
    }
    _destroyParticle (p) {
        if (p.sprite) {
            this._container.removeChild(p.sprite);
        }
        this._factory.destroyParticle(p);
    }
    _createParticle() {
        var p = this._factory.create();
        this.onInitParticle(p);

        var len = this._initializer.length;
        for (var i=0; i<len; i++) {
            this._initializer[i].init(this, p);
        }

        if (p.sprite)
            this._container.addChild(p.sprite);
        this._particles.push(p);
    }
    getContainer() {
        return this._container;
    }
    onInitParticle(p) {
        // overwrite if you like
    }
    updateOnFrame(time) {
        if (!this._running || !this._started)
            return;

        var numNewPartilces = this.counter.spawnParticles(this, time);
        for(var i=0; i<numNewPartilces; i++) {
            this._createParticle();
        }

        var i=0, len = this._emitterActions.length;
        for(;i<len; i++)
            this._emitterActions[i].update(this, time);

        // update actions
        var p=0, lenP = this._particles.length;
        for(;p<lenP; p++) {
            i=0, len = this._actions.length;
            for(;i<len; i++) {
                this._actions[i].update(this, this._particles[p], time);
            }
        }

        // update pos, remove dead
        var p=0;  // lenP = this._particles.length;
        for(;p<this._particles.length; p++) {
            var it = this._particles[p];
            if (it.isDead) {
                this._destroyParticle(it);
                this._particles.splice(p, 1);
                // TODO double check that this is working.
                // I assume we must not increment p here.
                // but right now no time to change this.
            }
            else {
                it.applyToSprite();
            }
        }
    }
}
