/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2013, Christoph Schnackenberg <bluechs@gmx.de>
 * Copyright (c) 2013, Johannes Brosi <mail@jbrosi.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 */
define([], function() {
    "use strict";
    /** @class base class for entity activation */
    function BaseEntityActivator() {       
    }
    BaseEntityActivator.prototype = {
        /** @param {Entity} entity activates the entity */
        check: function(entity)
        {
            // OVERWRITE
            return false;
        },
         /**
          * updates entities
          *
          * @param {Array} newEntities
          * @param {Array} alwaysActive
          * @param {Array} activeEntities
          * @param {Array} deactiveEntities
          **/
        updateEntityActivation: function(
                newEntities,
                alwaysActive,
                activeEntities,
                deactiveEntities)
        {
            var len, i;
            /** @type Entity */
            var entity;       
            /** @type Array */       
            var newDeactives = [];
            // ALWAYS ACTIVE entities
            for (i=0; i<alwaysActive.length; i++) {
                entity = alwaysActive[i]; 
                if (entity.isGarbage()) {
                    if (i < alwaysActive.length-1) // SWAP 
                        alwaysActive[i] = alwaysActive[alwaysActive.length-1];
                   alwaysActive.pop(); // DELETE
                   entity.onDeactivate();
                   entity.onDispose();
                }             
            }
            // ACTIVE entities
            for (i=0; i<activeEntities.length; i++) {				
                entity = activeEntities[i]; 
                if (entity.isGarbage()) {
                    if (i < activeEntities.length-1) // SWAP 
                        activeEntities[i] = activeEntities[activeEntities.length-1];
                   activeEntities.pop(); // DELETE
                   entity.onDeactivate();
                   entity.onDispose();
                }             
                else if (!this.check(entity)) {                
                    if (i < activeEntities.length-1) // SWAP 
                        activeEntities[i] = activeEntities[activeEntities.length-1];
                    activeEntities.pop(); // DELETE
                    newDeactives.push(entity);
                    entity.onDeactivate();
                }
            }
            // DEACTIVE entities
            for (i=0; i<deactiveEntities.length; i++) {
               entity = deactiveEntities[i]; 
               if (entity.isGarbage()) {
                   if (i < deactiveEntities.length-1) // SWAP 
                        deactiveEntities[i] = deactiveEntities[deactiveEntities.length-1];                
                   deactiveEntities.pop(); // DELETE
                   entity.onDispose();
               }  
               else if (this.check(entity)) {
                   if (i < deactiveEntities.length-1) // SWAP 
                        deactiveEntities[i] = deactiveEntities[deactiveEntities.length-1];                
                   activeEntities.push(entity);
                   entity.onActivate();
                   deactiveEntities.pop(); // DELETE
                }
            }
            len = newDeactives.length;
            for (i=0; i<len; i++)
                deactiveEntities.push(newDeactives[i]);
            // NEW entities
            len = newEntities.length;
            for (i=0; i<len; i++) {
                entity = newEntities.pop();                        
                if (entity.props.alwaysActive) {
                    entity.onActivate();
                    activeEntities.push(entity);
                }
                else {
                    if (this.check(entity)) {
                        entity.onActivate();
                        activeEntities.push(entity);
                    }
                    else {
						if (!entity.isGarbage())
							deactiveEntities.push(entity);    
						else {
						}
                    }
                }
            }
        }
    };

    return BaseEntityActivator;
});