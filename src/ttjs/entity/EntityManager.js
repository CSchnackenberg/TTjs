/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2013, Christoph Schnackenberg <bluechs@gmx.de>
 * Copyright (c) 2013, Johannes Brosi <mail@jbrosi.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 */
define([
	'env',
	'ttjs/lib/lodash',
	'ttjs/entity/Entity'
],
function(
	env,
	_,
	Entity
) {
    "use strict";
	
    /**
     * Handles all entities.
     * 
     * @param {BaseEntityActivator} _entityActivator subclass to deal with activation/deactivation
     * @returns {EntityManager}
     */
    function EntityManager(_entityActivator, factory) {
        
        /** @type BaseEntityActivator */
        this.entityActivator = _entityActivator;
        
        /** active entities */
        this._actives = [];
        /** active entities */
        this._alwaysActives = [];
        /** active entities */
        this._deactives = [];	
        /** @type Array */
        this._newEntities = []; 
		/** @type EntityFactory */
		this._factory = factory;
    }

    EntityManager.prototype = {
		/**
		 * Creates new entity(ies) and inject it as a new instance
		 * into the management process. 
		 * 
		 * This function will return when
		 * a) all component scripts are loaded
		 * b) all required resources are loaded
		 * c) everything is glued together
		 * 
		 * If the data is already loaded than it'll return
		 * instantly.
         * 
         * If the entity cannot be created a error is sent to
         * the logger.error function. OnReady will still
         * be called. 
		 * 
		 * @param {mixed} instance
		 * @param {function} onReady 1. parameter is the array with the created entity instances
		 * @returns {undefined}
		 */
		injectEntity: function(instance, onReady, logger) {					
			var thiz = this;
			this._factory.preloadEntities(instance, function(preparedEntities) { 
				var createdEntities = thiz.injectPreloadedEntity(preparedEntities);
				onReady(createdEntities);
			}, logger || console);
		},
		/**
		 * Creates an entity that is known to be preloaded.
		 * 
		 * @param {EntityInstance} preloadInstaceData
		 * @returns {undefined}
		 */
		injectPreloadedEntity: function(preloadInstaceData, logger) {
			logger = logger || console;
			preloadInstaceData = preloadInstaceData || [];
			if (!_.isArray(preloadInstaceData))
				preloadInstaceData = [preloadInstaceData];			
			var i, len, i2, len2;
			len = preloadInstaceData.length;
			var validEntities = [];
			for (i=0; i<len; i++) {
				var instanceData = preloadInstaceData[i];
				var instance = new Entity(
						instanceData.name,
						instanceData.spatial,
						instanceData.parsedProperties,
						instanceData.instanceProperties);	
				instance.id = instanceData.id;
				// At this point we have a fully inited
				// entity object.
				// 
				// To really use it we have to call "onInit".				
				instance.manager = this;
				len2 = instanceData.componentClasses.length;
				for (i2=0; i2<len2; i2++) {
					var cmp = new instanceData.componentClasses[i2]();						
					var cmpName = instanceData.componentClassNames[i2];
					instance.addComponent(cmp, cmpName);
				}
				instance.onInit();
				if (instance.getState() !== 'inited') {
					logger.error("Inject entity failed. OnInit returned status '"+ instance.getState() + "'", instance);
					instance.manager = null;
					continue;
				}						
				this._newEntities.push(instance);
				validEntities.push(instance);
			}
			return validEntities;
		},
        /**
         * Send a message to all entities in the scene.
         * 
         * @param {String} name identifyer of the message
         * @param {type} params data you want to send
         * @param {type} activesOnly true: only active entities get the message
         * @returns {undefined}
         */
        sendMessage: function(name, params, activesOnly) {
            var i;
            var len;
            len = this._actives.length;		
            for (i=0; i<len; i++)
                this._actives[i].sendMessage(name, params);
            len = this._alwaysActives.length;		
            for (i=0; i<len; i++)
                this._alwaysActives[i].sendMessage(name, params);
            if (!activesOnly) {
                len = this._deactives.length;
                for (i=0; i<len; i++)
                    this._deactives[i].sendMessage(name, params);
            }
        },
        firstUpdate: function() {
            // perform activation
            this.entityActivator.updateEntityActivation(
                    this._newEntities,
                    this._alwaysActives,
                    this._actives,
                    this._deactives
                );  
        },
        /**
         * Should be called once per frame. It updates
         * all entities, all componentens and performs
         * the activation/deactivation process.
         * 
         * @param {Number} elapsedTime number of seconds that elapsed since last update
         * @returns {Number} number of updated elements
         */
        update: function(elapsedTime) {
            // update
            var i;
            var len;            
            var all = 0;
            len = this._actives.length;		
            for (i=0; i<len; i++)
                this._actives[i].onUpdate(elapsedTime);
            all += len;

            len = this._alwaysActives.length;		
            for (i=0; i<len; i++)
                this._alwaysActives[i].onUpdate(elapsedTime);
            all += len;

            // perform activation
            this.entityActivator.updateEntityActivation(
                    this._newEntities,
                    this._alwaysActives,
                    this._actives,
                    this._deactives
                );
            return all;
        },
		getResource: function(type, url) {
			return this._factory._resourceManager.getResource(type, url);
		}
    };

    return EntityManager;
});