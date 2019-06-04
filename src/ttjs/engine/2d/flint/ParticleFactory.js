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
define([   
   'ttjs/engine/2d/flint/Particle'    
], function(
   Particle
)
{    
    "use strict";

    const Pool = function() {
        this._cache = [];
        this._createdObjects = 0;
    };

    Pool.prototype.putBack = function(p) {
        this._cache.push(p);
    };
    Pool.prototype.takeOut = function(p) {
        if (this._cache.length == 0) {
            this._createdObjects++;

            if (this._createdObjects > 10000) {
                console.error("Created more than 10k particle objects. Likely a memory leak.");
            }

            return new Particle();
        }
        return this._cache.pop();
    };


    /**
     * Class to create particles. At some point later we
     * can introduce a cached concept here.
     */
    var ParticleFactory = function(useCache = false) {
        this._pool = useCache ? new Pool() : null;
    };
    ParticleFactory.prototype.create = function() {   
        return this._pool ? this._pool.takeOut() : new Particle();
    };
    ParticleFactory.prototype.destroyParticle = function(particle) {
        if (this._pool) {
            particle.sprite.reset();
            particle.reset();
            this._pool.putBack(particle);
        }
	};   
    
    return ParticleFactory;
});