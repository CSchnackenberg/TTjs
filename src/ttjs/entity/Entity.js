/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2013, Christoph Schnackenberg <bluechs@gmx.de>
 * Copyright (c) 2013, Johannes Brosi <mail@jbrosi.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 */
define(['env'], function(env) {
    "use strict";

    function Entity(name, spatial, properties, rawProperties) {	
        // private                
        this._components = [];	
		this._componentNames = [];        
		this._instanceProperties = rawProperties;
        /** 
         * the state of the entity
         * 
         * uninited: new entity
         * initing: the initprocess is in progress
         * inited: entity is ready and working
		 * active: entity is activly working/running
		 * deactive: entity is sleeping
         * ignored: entity is okay but should not be used
         * error: the entity cannot be used     
         * disposed: the entity can be deleted
         **/
        this._state = "uninited";
        /** @type {string} description of the state */
        this._stateMsg = "";

        // public
        this.props = properties || {};    
		this.name = name;
        this.spatial = spatial;
        this.manager = null; 
    };
        
    Entity.prototype = {
        getSpatial: function() {
            return this._spatial;
        },
        /** properties for ... */
        getInstanceProperties: function() {
            return this._instanceProperties;
        },
        /* adds component */
        addComponent: function(cmp, cmpName) {
            cmp.entity = this;
            this._components.push(cmp);
			this._componentNames.push(cmpName);
        },
        findComponent: function(cmpName) {
            var len = this._components.length;
            for(var i=0; i<len; i++) {
				if (this._componentNames[i].toLowerCase() ===
					cmpName.toLowerCase())	
					return this._components[i];
            }
            return null;
        },
        setState: function(newState, stateReason) {
            // TODO ensure state values!
            this._state = newState;
            if (stateReason)
                this._stateMsg = stateReason;
        },
        getState: function() {
            return this._state;
        },
        /** flag this object as garbage */
        dispose: function() {
            this.setState("disposed");
        },
        /** @return {bool} true if object is not needed anymore */
        isGarbage: function() {
            switch(this._state) {
                case "ignored":
                case "error":
                case "disposed": return true;
            }
            return false;
        },
        /** for some states (like error) this contains additional expl */ 
        getStateDescription: function() {
            return this._stateMsg;
        },
        onInit: function() {
            this._state = "initing";
            var result;
            var len = this._components.length;
            for(var i=0; i<len; i++) {
                this._components[i].onInit(this);
            }
            // success
            if (this._state === "initing")
                this._state = "inited";
        },
        onUpdate: function(time) {
            var len = this._components.length;
            for(var i=0; i<len; i++) {
                this._components[i].onUpdate(this, time);
            }
        },
        onActivate: function() {
            var len = this._components.length;
			this.setState("active");
            for(var i=0; i<len; i++) {
                this._components[i].onActivate(this);
            }			
        },	
        onDeactivate: function() {
            var len = this._components.length;
			this.setState("deactive");
            for(var i=0; i<len; i++) {
                this._components[i].onDeactivate(this);
            }
        },
		onDispose: function() {
            var len = this._components.length;
			this.setState("disposed");
            for(var i=0; i<len; i++) {
                if (this._components[i].onDispose)
					this._components[i].onDispose(this);
            }			
        },
        dump: function() {
            var len = this._components.length;
            var out = "Entity: "+this._name+"\n";
            out += "Components ["+len+"] {\n";                
            for(var i=0; i<len; i++) {				
                out += "  " + env.getObjectClass(this._components[i]) + "\n";
            }
            out += "}\n";
            env.log(out);
        },
        /* sends message to all components */
        sendMessage: function(name, params) {
            var len = this._components.length;
            var msgName = "onMessage_"+name;
            for(var i=0; i<len; i++) {
                var cmp = this._components[i];	                
				if (cmp[msgName])
                    cmp[msgName](this, params);
            }
        }        
    };
    
    return Entity;
});