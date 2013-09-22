/**
 * TODO
 */
define([   
   'ttjs/engine/2d/flint/Particle'    
], function(   
)
{        
    "use strict";
    var Emitter = function(displayContainer, factory) {        
        this.counter = null;        
        
        this._started = false;
        this._running = false;        
        this._container = displayContainer;
        this._actions = [];
        this._emitterActions = [];
        this._initializer = [];
        this._particles = [];     
        this._factory = factory;
    };
    var p = Emitter.prototype;
    
    p._destroyParticle = function (p) {        
        if (p.sprite)
            this._container.removeChild(p.sprite);
        this._factory.destroyParticle(p);
    }
    
    p._createParticle = function() {
        var p = this._factory.create();
        this.onInitParticle(p);
        
        var len = this._initializer.length;
        for (var i=0; i<len; i++) {
            this._initializer[i].init(p);
        }
        
        if (p.sprite)
            this._container.addChild(p.sprite);
        this._particles.push(p);
    }    
    
    p.getContainer = function() {
        return this._container;
    }
    p.onInitParticle = function(p) {
        // overwrite if you like
    }
    
    p.updateOnFrame = function(time) {
		if (!this._running || !this._started)
			return;

		var numNewPartilces = this.counter.spawnParticles(this, time);
		for(var i=0; i<numNewPartilces; i++)
			this._createParticle();

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
        var p=0; lenP = this._particles.length;
        for(;p<lenP; p++) {
            var it = this._particles[p];
            if (it.isDead) {
                this._destroyParticle(it);
            }
            else {
                it.applyToSprite();
            }
        }			
	}
    
    return Emitter;
});