define(["require", "exports", "@ttjs/engine/2d/flint/Particle"], function (require, exports, Particle_1) {
    "use strict";
    exports.__esModule = true;
    exports.ParticleFactory = exports.Pool = void 0;
    // define([
    //    'ttjs/engine/2d/flint/Particle'
    // ], function(
    //    Particle
    // )
    // {
    "use strict";
    function Pool() {
        this._cache = [];
        this._createdObjects = 0;
    }
    exports.Pool = Pool;
    ;
    Pool.prototype.putBack = function (p) {
        this._cache.push(p);
    };
    Pool.prototype.takeOut = function (p) {
        if (this._cache.length == 0) {
            this._createdObjects++;
            if (this._createdObjects > 10000) {
                console.error("Created more than 10k particle objects. Likely a memory leak.");
            }
            return new Particle_1.Particle();
        }
        return this._cache.pop();
    };
    /**
     * Class to create particles. At some point later we
     * can introduce a cached concept here.
     */
    function ParticleFactory(useCache) {
        if (useCache === void 0) { useCache = false; }
        this._pool = useCache ? new Pool() : null;
    }
    exports.ParticleFactory = ParticleFactory;
    ;
    ParticleFactory.prototype.create = function () {
        return this._pool ? this._pool.takeOut() : new Particle_1.Particle();
    };
    ParticleFactory.prototype.destroyParticle = function (particle) {
        if (this._pool) {
            particle.sprite.reset();
            particle.reset();
            this._pool.putBack(particle);
        }
    };
});
//     return ParticleFactory;
// });
//# sourceMappingURL=ParticleFactory.js.map