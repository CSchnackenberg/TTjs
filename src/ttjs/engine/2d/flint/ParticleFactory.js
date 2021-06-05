define(["require", "exports", "@ttjs/engine/2d/flint/Particle"], function (require, exports, Particle_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ParticleFactory = exports.Pool = void 0;
    class Pool {
        constructor() {
            this._cache = [];
            this._createdObjects = 0;
        }
        putBack(p) {
            this._cache.push(p);
        }
        takeOut() {
            if (this._cache.length == 0) {
                this._createdObjects++;
                if (this._createdObjects > 10000) {
                    console.error("Created more than 10k particle objects. Likely a memory leak.");
                }
                return new Particle_1.Particle();
            }
            return this._cache.pop();
        }
    }
    exports.Pool = Pool;
    /**
     * Class to create particles. At some point later we
     * can introduce a cached concept here.
     */
    class ParticleFactory {
        constructor(useCache = false) {
            this._pool = useCache ? new Pool() : null;
        }
        create() {
            return this._pool ? this._pool.takeOut() : new Particle_1.Particle();
        }
        destroyParticle(particle) {
            if (this._pool) {
                particle.sprite.visible = false; // !!!!!!!!! PIXI !!!!!!!!!! this is enough?
                // TODO check with old sprite.reset
                particle.reset();
                this._pool.putBack(particle);
            }
        }
    }
    exports.ParticleFactory = ParticleFactory;
});
// export function Pool() {
//     this._cache = [];
//     this._createdObjects = 0;
// };
//
// Pool.prototype.putBack = function(p) {
//     this._cache.push(p);
// };
// Pool.prototype.takeOut = function(p) {
//     if (this._cache.length == 0) {
//         this._createdObjects++;
//
//         if (this._createdObjects > 10000) {
//             console.error("Created more than 10k particle objects. Likely a memory leak.");
//         }
//
//         return new Particle();
//     }
//     return this._cache.pop();
// };
//
//
// /**
//  * Class to create particles. At some point later we
//  * can introduce a cached concept here.
//  */
// export function ParticleFactory(useCache = false) {
//     this._pool = useCache ? new Pool() : null;
// };
// ParticleFactory.prototype.create = function() {
//     return this._pool ? this._pool.takeOut() : new Particle();
// };
// ParticleFactory.prototype.destroyParticle = function(particle) {
//     if (this._pool) {
//         particle.sprite.reset();
//         particle.reset();
//         this._pool.putBack(particle);
//     }
// };
//# sourceMappingURL=ParticleFactory.js.map