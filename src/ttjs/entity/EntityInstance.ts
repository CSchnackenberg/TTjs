/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2013, Christoph Schnackenberg <bluechs@gmx.de>
 * Copyright (c) 2013, Johannes Brosi <mail@jbrosi.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 */
// define([], function() {

"use strict";
    
    
/**
 * Description for an Entity instance in the game world
 *
 * @constructor
 * @param {name} the instance name of the element (may be "")
 * @param {type} entityDefName name/id of the entity definition
 * @param {type} spatial geometrical information to place the object in a 2d/3d world
 * @param {type} instanceProperties unparsed(!) properties of the instance
 * @returns {EntityInstance}
 */
export function EntityInstance(name, entityDefName, spatial, instanceProperties) {
    this.name = name || "";
    this.entityDefinitionName = entityDefName;
    this.spatial = spatial;
    this.instanceProperties = instanceProperties;
    this.parsedProperties = {};
}
		
// 	return EntityInstance;
// });