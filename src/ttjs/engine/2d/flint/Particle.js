/**
 * TODO
 */
define([    
], function(
)
{
    "use strict";
    var Particle = function() {
        this.reset();
    };
    Particle.prototype.reset = function() {   
        this.mixColor  = {r:1,g:1,b:1,a:1};
        this.scale = {x: 1, y: 1};
        this.mass = 1;
        this.lifetime = 0;
        this.age=0;
        this.energy = 1; 
        this.isDead = false;        
        this.position = {x: 0, y:0};
        this.lastPosition = {x: 0, y:0};
        this.velocity = {x: 0, y:0};
        this.rotation = 0;
        this.rotVelocity = 0;
        this.collisionRadius = 1;
        this.sortValue = 0;        
        this.sprite = null;
    };
    Particle.prototype.getInertia = function() {
        return this.mass * this.collisionRadius * this.collisionRadius * 0.5;
    }
    
    Particle.prototype.applyToSprite = function() {
        if (!this.sprite)
			return;

//		if (this.rotation != 0 ||
//			this.scale != 1)
//		{
////			AffineMatrix mm;
////			mm.scale(scale, scale);
////			mm.rotate(rotation);
////			//Number cosv = scale * cos( rotation );
////			//Number sinv = scale * sin( rotation );			
////			sprite->setPosition(position);
////			sprite->setTransformEnable(true);
////			sprite->setTransform(mm);
//		}
//		else
//		{
////			sprite->setTransformEnable(false);
////			sprite->setPosition(position);
//		}
////		this.sprite.setSortValue(sortValue);
////		this.sprite.setMixColor(mixColor);
    
        this.sprite.rotation = this.rotation;
        this.sprite.scaleX = this.scale.x;
        this.sprite.scaleY = this.scale.y;
        this.sprite.x = this.position.x;
        this.sprite.y = this.position.y;
        this.sprite.alpha = this.mixColor.a;
        
        // :( color color matrix, no blend mode currently

    }
    
    return Particle;
});