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
	'ttjs/lib/lodash'
],
function(
		_
) {    
    "use strict";
	
	/** @class  */
    function ResourceManager() {
		this._manager = {};
		this._callbackStack = [];
		this._loadState = 0;
        this.maxParallel = 5;
	}
	
	ResourceManager.prototype = {
		/**
		 * Adds a new resource type to your manager.		 		 
		 * 
		 * @param {type} newManager
		 * @returns {unresolved}
		 */
		addManager: function(newManager) {
			if (!newManager || !newManager.getType()) {
				console.error("Cannot add manager ", newManager);
				return;
			}
			if (this._manager.hasOwnProperty(newManager.getType().toLowerCase())) {
				console.error("Cannot add manager with type ", newManager.getType(), ". Already in resource manager.");
				return;
			}			
			// add new resource manger and setup for processing
			this._manager[newManager.getType().toLowerCase()] = newManager;			
			newManager.storage = {};
            newManager.manager = this;
		},
		/**
		 * Starts the loading of multiple resources. 
		 * You can load all resource types that your ResourceLoader
		 * implementations support.
		 * 
		 * The callback is called when all requested resources,
		 * that can be handled by the manager are loaded or 
		 * reported an error. If there are already elements
		 * in the loading queue the callback will wait for them
		 * as well. 
		 * 
		 * TODO: impl a reference counting system for the resources
		 * 
		 * @param {Array} resources 
		 * @param {type} callback
		 * @returns {undefined}
		 */
		request: function(resources, callback) {
			if (_.isEmpty(resources)) {
				console.error("Request data is empty.");
				return;
			}					
			if (!_.isArray(resources))
				resources = [resources];
			this._callbackStack.push(callback);		
			// get through all resources
			var i, len = resources.length;
			for (i=0; i<len; i++) {
				var url = resources[i].url || "";
				var type = resources[i].type || "";				
				if (!this._manager.hasOwnProperty(type.toLowerCase())) {
					console.error("Cannot request resource ",url," with type", type, ". Unknown manaqger");
					continue;
				}
				var manager = this._manager[type.toLowerCase()];
				var existingInformation = manager.storage[url];			
				var needReload = false;
				if (!existingInformation ||
					existingInformation.state === "error") {
					needReload = true;
					
					if (existingInformation &&
						existingInformation.state === "error")
						console.log("Change resource state for '",existingInformation.url,"' from 'error' to 'new'");
					else
						console.log("New resource with url '", url,"'.");
				}
				if (needReload) {
					manager.storage[url] = {
						state: "new",
						url: url,
						resource: null				
					};
				}
			}			
			if (this._loadState < this.maxParallel)
				this._loadNext();
		},
		/**
		 * intern method to load the next resource
		 * @returns {undefined}
		 */
		_loadNext: function() {
			//this._loadState = "loading";
			var thiz = this;
			//var somethingToLoad = false;
			_.forEach(this._manager, function(manager) {
				_.forEach(manager.storage, function(resInfo) {
					if (resInfo.state === "new") {
						console.log("Change resource state for '",resInfo.url,"' from 'new' to 'pending'");
						resInfo.state = "pending";
						//somethingToLoad = true;
                        thiz._loadState++;
						manager.load(resInfo.url, function(success, res) {
							if (success) {
								console.log("Change resource state for '",resInfo.url,"' from 'pending' to 'loaded'");
								resInfo.state = "loaded";
								resInfo.resource = res;
							}
							else {
								console.log("Change resource state for '",resInfo.url,"' from 'pending' to 'error'");
								resInfo.state = "error";
								resInfo.resource = res; // error code
							}
                            thiz._loadState--;
                            if (thiz._loadState < thiz.maxParallel)
                                thiz._loadNext();
						});
                        if (thiz._loadState >= thiz.maxParallel)
                            return false;
					}
				});
				if (thiz._loadState >= thiz.maxParallel)
					return false;
			});			
			// If we reach this point no manager has resources
			// with the state "new". That means all resources
			// are either "error" or "loaded". In both cases
			// we can stop loading and perform the callbacks and
			// set the 
			if (thiz._loadState === 0) {
				//this._loadState = "none";
				this._performCallback();
			}			
		},
		/**
		 * returns the resource type of the resource handler
		 * that can deal with the type of the given url.
		 * 
		 * If no handler can handle the type false:boolean is returned
		 * 
		 * If more than one handler can deal with the type true:boolean
		 * is returned.
		 * 
		 * IMPORTANT: always use this function with '===' never simply
		 * with '=='.
		 * 
		 * @returns {mixed} boolean or string
		 */
		detectResourceType: function(url) {
			var possibleHandler = [];			
			_.forEach(this._manager, function(manager) {				
				if (manager.canHandle(url))
					possibleHandler.push(manager);				
			});			
			if (possibleHandler.length === 0)
				return false;
			if (possibleHandler.length > 1) {
				var errMsg = "";
				for (var i=0; i<possibleHandler.length; i++)
					errMsg += (i > 0 ? ", ": "") + possibleHandler[i].getType();
				return true;
			}			
			return possibleHandler[0].getType();
		},
        getManagerByType: function(type) {
			type = type || "";
            if (this._manager.hasOwnProperty(type.toLowerCase()))
                return this._manager[type.toLowerCase()];
            return null;
        },
        getResourceInfo: function(type, url) {
			type = type || "";
			url = url || "";
            if (this._manager.hasOwnProperty(type.toLowerCase())) {
                return this._manager[type.toLowerCase()].storage[url];
            }
            return null;
        },
        getResource: function(type, url) {
            var resInfo = this.getResourceInfo(type, url);
            if (resInfo) {				
                return resInfo.resource;
            }
            return null;
        },
		isResourceLoaded: function(type, url) {
            var resInfo = this.getResourceInfo(type, url);
            if (resInfo) {
                return (resInfo.state === "loaded");
            }
            return false;
        },
		_performCallback: function() {
			var safeCallbacks = _.clone(this._callbackStack);
			this._callbackStack = [];
			_.forEach(safeCallbacks, function(cb) {
				cb(this);
			});
		}
	};
	
	return ResourceManager;
});