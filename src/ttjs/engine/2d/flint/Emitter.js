define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Emitter = void 0;
    class Emitter {
        constructor(displayContainer, factory) {
            this.counter = null;
            this._started = false;
            this._running = false;
            this._actions = [];
            this._emitterActions = [];
            this._initializer = [];
            this._particles = [];
            this._container = displayContainer;
            this._factory = factory;
        }
        addAction(action) {
            this._actions.push(action);
            return this;
        }
        addEmitterAction(action) {
            this._emitterActions.push(action);
            return this;
        }
        addInitializer(ini) {
            this._initializer.push(ini);
            return this;
        }
        pause() {
            this._running = false;
        }
        resume() {
            this._running = true;
        }
        start() {
            if (!this.counter) {
                console.error("An emitter requires a counter");
                return;
            }
            if (this._started)
                return;
            this._started = true;
            this._running = true;
            var len = this._emitterActions.length;
            for (var i = 0; i < len; i++) {
                this._emitterActions[i].init(this);
            }
            var startParticleCount = this.counter.startEmitter(this);
            for (var i = 0; i < startParticleCount; i++)
                this._createParticle();
        }
        _destroyParticle(p) {
            if (p.sprite) {
                this._container.removeChild(p.sprite);
            }
            this._factory.destroyParticle(p);
        }
        _createParticle() {
            var p = this._factory.create();
            this.onInitParticle(p);
            var len = this._initializer.length;
            for (var i = 0; i < len; i++) {
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
            for (var i = 0; i < numNewPartilces; i++) {
                this._createParticle();
            }
            var i = 0, len = this._emitterActions.length;
            for (; i < len; i++)
                this._emitterActions[i].update(this, time);
            // update actions
            var p = 0, lenP = this._particles.length;
            for (; p < lenP; p++) {
                i = 0, len = this._actions.length;
                for (; i < len; i++) {
                    this._actions[i].update(this, this._particles[p], time);
                }
            }
            // update pos, remove dead
            var p = 0; // lenP = this._particles.length;
            for (; p < this._particles.length; p++) {
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
    exports.Emitter = Emitter;
});
//# sourceMappingURL=Emitter.js.map