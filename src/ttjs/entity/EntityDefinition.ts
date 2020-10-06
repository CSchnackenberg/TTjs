/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2013, Christoph Schnackenberg <bluechs@gmx.de>
 * Copyright (c) 2013, Johannes Brosi <mail@jbrosi.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 */
// define([], function()
// {

"use strict";

/** @class  */
// export function EntityDefinition()
// {
//     /** @type bool static entites are always instantiated */
//     this.isStatic = false;
//     /** @type String */
//     this.name = "";
//     /** @type Array */
//     this.components = [];
//     /**  */
//     this.parent = null;
//     /** property family */
//     this.family = [];
//     /** unparsed properties */
//     this.properties = {};
//     /** information about the definition origin */
//     this.source = {};
// }


export class EntityDefinition {

    /** @type bool static entites are always instantiated */
    public isStatic = false;
    /** @type String */
    public name = "";
    /** @type Array */
    public components:string[] = [];
    /**  */
    public parent:string = null;
    /** property family */
    public family:string[] = [];
    /** unparsed properties */
    public properties:any = {};
    /** information about the definition origin */
    public source:any = {};
    /** information about the definition origin */
    public type:string = "";

    constructor() {

    }
}
