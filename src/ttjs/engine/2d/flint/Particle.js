define(["require", "exports", "@ttjs/lib/pixi-legcay"], function (require, exports, PIXI) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Particle = void 0;
    var rgb2hex = PIXI.utils.rgb2hex;
    class Particle {
        constructor() {
            this.mixColor = [1, 1, 1, 1];
            this.scale = { x: 1, y: 1 };
            this.position = { x: 0, y: 0 };
            this.lastPosition = { x: 0, y: 0 };
            this.velocity = { x: 0, y: 0 };
            this.reset();
        }
        reset() {
            this.mixColor[0] = 1;
            this.mixColor[1] = 1;
            this.mixColor[2] = 1;
            this.mixColor[3] = 1;
            this.scale.x = 1;
            this.scale.y = 1;
            this.position.x = 0;
            this.position.y = 0;
            this.lastPosition.x = 0;
            this.lastPosition.y = 0;
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.mass = 1;
            this.lifetime = 0;
            this.age = 0;
            this.energy = 1;
            this.isDead = false;
            this.rotation = 0;
            this.rotVelocity = 0;
            this.collisionRadius = 1;
            this.sortValue = 0;
            this.sprite = null;
            this.blendMode = PIXI.BLEND_MODES.ADD;
        }
        getInertia() {
            return this.mass * this.collisionRadius * this.collisionRadius * 0.5;
        }
        ;
        applyToSprite() {
            if (!this.sprite)
                return;
            this.sprite.rotation = this.rotation;
            this.sprite.scale.set(this.scale.x, this.scale.y);
            this.sprite.x = this.position.x;
            this.sprite.y = this.position.y;
            this.sprite.alpha = this.mixColor[3];
            this.sprite.blendMode = this.blendMode; //; compositeOperation = this.compositeOperation;
            this.sprite.tint = rgb2hex(this.mixColor);
            // color mix?
        }
        ;
    }
    exports.Particle = Particle;
});
// export function Particle() {
//     this.mixColor  = {r:1,g:1,b:1,a:1};
//     this.scale = {x: 1, y: 1};
//     this.position = {x: 0, y:0};
//     this.lastPosition = {x: 0, y:0};
//     this.velocity = {x: 0, y:0};
//
//     this.reset();
// }
// Particle.prototype.reset = function() {
//     this.mixColor.r = 1;
//     this.mixColor.g = 1;
//     this.mixColor.b = 1;
//     this.mixColor.a = 1;
//     this.scale.x = 1;
//     this.scale.y = 1;
//     this.position.x = 0;
//     this.position.y = 0;
//     this.lastPosition.x = 0;
//     this.lastPosition.y = 0;
//     this.velocity.x = 0;
//     this.velocity.y = 0;
//
//     this.mass = 1;
//     this.lifetime = 0;
//     this.age=0;
//     this.energy = 1;
//     this.isDead = false;
//     this.rotation = 0;
//     this.rotVelocity = 0;
//     this.collisionRadius = 1;
//     this.sortValue = 0;
//     this.sprite = null;
//     this.compositeOperation = null;
// };
// Particle.prototype.getInertia = function() {
//     return this.mass * this.collisionRadius * this.collisionRadius * 0.5;
// };
//
// Particle.prototype.applyToSprite = function() {
//     if (!this.sprite)
//         return;
//
//
//     this.sprite.rotation = this.rotation;
//     this.sprite.scaleX = this.scale.x;
//     this.sprite.scaleY = this.scale.y;
//     this.sprite.x = this.position.x;
//     this.sprite.y = this.position.y;
//     this.sprite.alpha = this.mixColor.a;
//     this.sprite.compositeOperation = this.compositeOperation;
//
//     // color mix?
// };
//
//# sourceMappingURL=Particle.js.map