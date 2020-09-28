import {TTTools as env} from "@ttjs/util/TTTools";

/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2020, Christoph Schnackenberg <bluechs@gmx.de>
 * Copyright (c) 2013, Johannes Brosi <mail@jbrosi.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 */

// /**
//  * @class BaseClass for all components
//  **/
// export function Component()
// {
//     /** @type Entity link to the owner entity */
//     this.entity = null;
// }
//
// Component.prototype = {
//
//     /** Send a message to all entity components */
//     sendMessageToEntity: function(name, params)
//     {
//         this.entity.sendMessage(name, params);
//     },
//
//     /** Send a message to all active entities */
//     sendMessageToActive: function(name, params)
//     {
//         this.entity.manager.sendMessage(name, params, true);
//     },
//
//     /**
//      * Send a message to all entities.
//      *
//      * This should be used with caution as there may be thousends
//      * of entities to crawl.
//      **/
//     sendMessageToAll: function(name, params)
//     {
//         this.entity.manager.sendMessage(name, params, false);
//     },
//
//     /**
//      * Finds a component within this entitiy.
//      *
//      * @param {String} cmpName Class-Name of the component
//      **/
//     findComponent: function(cmpName)
//     {
//         return this.entity.findComponent(cmpName);
//     }
// };


export interface IEntity {
    props:any;
    manager:any;

    getSpatial():object;
    findComponent(cmpName:string):any;
    setState(newState:string, stateReason:string):void;
    getState():string;
    dispose():void;
    isGarbage():boolean;
    getStateDescription():string;
    sendMessage(name:string, params:any);
}

/**
 * @class BaseClass for components
 *
 **/
export abstract class Component {

    public entity:IEntity = null;

    constructor() {
        /** @type Entity link to the owner entity */
        this.entity = null;
    }

    /** Send a message to all entity components */
    sendMessageToEntity(name, params) {
        this.entity.sendMessage(name, params);
    }

    /** Send a message to all active entities */
    sendMessageToActive(name, params) {
        this.entity.manager.sendMessage(name, params, true);
    }

    /**
     * Send a message to all entities.
     *
     * This should be used with caution as there may be thousends
     * of entities to crawl.
     **/
    sendMessageToAll(name, params) {
        this.entity.manager.sendMessage(name, params, false);
    }

    /**
     * Finds a component within this entitiy.
     *
     * @param {String} cmpName Class-Name of the component
     **/
    findComponent(cmpName) {
        return this.entity.findComponent(cmpName);
    }

    abstract onInit(entity:IEntity):void;

    abstract onActivate(entity:IEntity):void;

    abstract onUpdate(entity:IEntity, elapsed:number):void;

    abstract onDeactivate(entity:IEntity):void;

    onDispose(entity:IEntity):void {
    }

}
