/**
 * TODO
 */
define([   
   'ttjs/engine/2d/flint/Particle'    
], function(
   Particle
)
{    
    "use strict";

    /**
     * Class to create particles. At some point later we
     * can introduce a cached concept here.
     */
    var ParticleFactory = function() {        
    };
    ParticleFactory.prototype.create = function() {   
        return new Particle();
    };
    ParticleFactory.prototype.destroyParticle = function(particle)
	{
		// gc will do that
	}    
    
    return ParticleFactory;
});