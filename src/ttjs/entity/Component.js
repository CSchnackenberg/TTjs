/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2013, Christoph Schnackenberg <bluechs@gmx.de>
 * Copyright (c) 2013, Johannes Brosi <mail@jbrosi.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 */
define([], function()
{

    /** 
     * @class BaseClass for all components 
     **/
    function Component()
    {	
        /** @type Entity link to the owner entity */
        this.entity = null;
    }

    Component.prototype = {

        /** Send a message to all entity components */
        sendMessageToEntity: function(name, params)
        {
            this.entity.sendMessage(name, params);
        },

        /** Send a message to all active entities */
        sendMessageToActive: function(name, params)
        {
            this.entity.manager.sendMessage(name, params, true);
        },

        /** 
         * Send a message to all entities.
         * 
         * This should be used with caution as there may be thousends
         * of entities to crawl.
         **/
        sendMessageToAll: function(name, params)
        {
            this.entity.manager.sendMessage(name, params, false);
        },

        /**
         * Finds a component within this entitiy. 
         * 
         * @param {String} cmpName Class-Name of the component
         **/
        findComponent: function(cmpName)
        {
            return this.entity.findComponent(cmpName);
        },   
   
        e:"e"
    };
    
    return Component;
});
