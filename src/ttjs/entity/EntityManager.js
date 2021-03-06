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
	'ttjs/util/TTTools',
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
		/** if true: it means */
		this._pendingInjections = 0;
		this._resetting = false;
		this._resetCallback = null;
    }

    EntityManager.prototype = {


		/**
		 * A wrapper function around injectEntity which assumes that the given instance can be injected
		 * with no further loading.
		 *
		 * It'll return null injection requires loading.
		 *
		 * It expects one instance and only returns exactly one
		 *
		 */
		injectEntitySync: function(instance, logger) {
			let entity = null;
			this.injectEntity(instance, function(e) {
				entity = e[0];
			}, logger||console);
			return entity;
		},
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
			this._pendingInjections++;
			this._factory.preloadEntities(instance, function(preparedEntities) {
				thiz._pendingInjections--;
				if (thiz._resetting) {
					if (thiz._pendingInjections <= 0) {
						thiz._resetting = false;
						this._resetCallback();
						this._resetCallback = null
					}
					return;
				}
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
					logger.error("Inject entity failed. OnInit returned status '"+ instance.getState() + "' with reason '" + instance.getStateDescription() + "'", instance);
					instance.manager = null;
					continue;
				}
				instance.origin = instanceData.entityDefinitionName;
				this._newEntities.push(instance);
				validEntities.push(instance);
			}
			return validEntities;
		},
        /**
         * Send a message to all entities in the scene.
         * 
         * @param {String} name identifier of the message
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
            if (activesOnly === false) {
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

        dump: function() {
            let out = "-----------\n";
            out += "NEW\n"
            out += "-----------\n";
            this._newEntities.forEach(e => out += e.dump(true));

            out += "\n-----------\n";
            out += "ALWAYS ACTIVE\n"
            out += "-----------\n";
            this._alwaysActives.forEach(e => out += e.dump(true));

            out += "\n-----------\n";
            out += "ACTIVE\n"
            out += "-----------\n";
            this._actives.forEach(e => out += e.dump(true));

            out += "\n-----------\n";
            out += "IN-ACTIVE\n"
            out += "-----------\n";
            this._deactives.forEach(e => out += e.dump(true));

            console.log(out);
        },

		getResource: function(type, url) {
			return this._factory._resourceManager.getResource(type, url);
		},
		/**
		 * Finds all entities which contains a specific component
		 *
		 * @param componentName
		 * @param activeOnly if false it also searches deactive entities
		 */
		findEntitiesWithComponent: function(componentName, activeOnly = true) {
			const candidates = [];
			const len = this._actives.length;
			for (let i=0; i<len; i++)
				if (this._actives[i].findComponent(componentName)) {
					candidates.push(this._actives[i]);
				}
			const len2 = this._alwaysActives.length;
			for (let i=0; i<len2; i++)
				if (this._alwaysActives[i].findComponent(componentName)) {
					candidates.push(this._alwaysActives[i]);
				}
			if (!activeOnly) {
				const len3 = this._deactives.length;
				for (let i=0; i<len3; i++)
					if (this._deactives[i].findComponent(componentName)) {
						candidates.push(this._deactives[i]);
					}
			}
			return candidates;
		},
		/**
		 * Finds all entities which contain the specific component and returns the component itself
		 *
		 * @param componentName
		 * @param activeOnly if false it also searches deactive entities
		 */
		findComponentsFromEntities: function(componentName, activeOnly = true) {
			const candidates = [];
			const len = this._actives.length;
			for (let i=0; i<len; i++) {
				const cmp = this._actives[i].findComponent(componentName);
				if (cmp) {
					candidates.push(cmp);
				}
			}
			const len2 = this._alwaysActives.length;
			for (let i=0; i<len2; i++){
				const cmp = this._alwaysActives[i].findComponent(componentName);
				if (cmp) {
					candidates.push(cmp);
				}
			}
			if (!activeOnly) {
				const len3 = this._deactives.length;
				for (let i=0; i<len3; i++){
					const cmp = this._deactives[i].findComponent(componentName);
					if (cmp) {
						candidates.push(cmp);
					}
				}
			}
			return candidates;
		},
		/**
		 * returns all entities with the given name or empty array
		 */
		findEntitiesByName: function(name, activeOnly = true) {
			const candidates = [];
			const len = this._actives.length;
			for (let i=0; i<len; i++) {
				if (this._actives[i].name == name)
					candidates.push(this._actives[i]);
			}
			const len2 = this._alwaysActives.length;
			for (let i=0; i<len2; i++){
				if (this._alwaysActives[i].name == name)
					candidates.push(this._alwaysActives[i]);
			}
			if (!activeOnly) {
				const len3 = this._deactives.length;
				for (let i=0; i<len3; i++){
					if (this._deactives[i].name == name)
						candidates.push(this._deactives[i]);
				}
			}
			return candidates;
		},
		/**
		 * returns null or first entity matching name
		 *
		 * @param name complete name of the entity. must match exactly
		 * @param activeOnly if false one can also search for deactive entities
		 * @param includeNew if true also entities in preparation are searched (useful during initialization)
		 */
		findFirstEntityWithName: function(name, activeOnly = true, includeNew = false) {
			const candidates = [];
			const len = this._actives.length;
			for (let i=0; i<len; i++) {
				if (this._actives[i].name == name)
					return this._actives[i];
			}
			const len2 = this._alwaysActives.length;
			for (let i=0; i<len2; i++){
				if (this._alwaysActives[i].name == name)
					return this._alwaysActives[i];
			}
			if (!activeOnly) {
				const len3 = this._deactives.length;
				for (let i=0; i<len3; i++){
					if (this._deactives[i].name == name)
						return this._deactives[i];
				}
			}
			if (includeNew) {
				const len4 = this._newEntities.length;
				for (let i=0; i<len4; i++){
					if (this._newEntities[i].name == name)
						return this._newEntities[i];
				}
			}
			return null;
		},
		/**
		 * Cleanup function to give all entities the chance to cleanup properly before
		 * the manager is dropped or reused.
		 *
		 * One must wait for the onReadyCallback to return to give the manager the chance to cleanup
		 * entities that were loading while calling this.
		 */
		reset: function(onReadyCallback) {
			this._resetting = true;

			// We simply set "dispose" to all entities that are active, deactive or always
			// active.
			//
			// updateEntityActivation does not guarantee to throw away all disposed entities at once we need
			// to do this until we find no active, always active or deactive entities anymore.
			//
			let found = 2;
			let sanity = 500;
			do {
				let len = this._actives.length;
				for (let i=0; i<len; i++) {
					this._actives[i].dispose();
				}
				if (len > 0)
					found++;
				len = this._alwaysActives.length;
				for (let i=0; i<len; i++){
					this._alwaysActives[i].dispose();
				}
				if (len > 0)
					found++;
				len = this._deactives.length;
				for (let i=0; i<len; i++){
					this._deactives[i].dispose();
				}
				if (len > 0)
					found++;
				this.entityActivator.updateEntityActivation(
					this._newEntities,
					this._alwaysActives,
					this._actives,
					this._deactives
				);
				found--;
				console.log("Cleanup loop: ", found);
			}while(found > 0 && sanity-- > 0);

			if (this._pendingInjections <= 0) {
				onReadyCallback();
			}
			else {
				this._resetCallback = onReadyCallback;
				// need to wait for the objects
			}
		}
    };

    return EntityManager;
});