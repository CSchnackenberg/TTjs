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
    'ttjs/entity/EntityDefinition'
    ],
function(
    env,
    EntityDefinition
)
{
	"use strict"; 
	/**
	 * The EntityDefinitionParser walks through a json array
	 * of entity data. It expects a list of properties,
	 * entities and components to help exposing  simple
	 * and understandable game objects in the design
	 * process.
	 * 
	 * -----------------------------------------------------------------			
	 * FIXME undefined behavior.
	 * 
	 * The following code expects the JavaScripts objects
	 * to ensure an ordered key-list. That is not the
	 * case and therefore may cause various issues.
	 * 
	 * This effects the source-format. It may not be
	 * { <entityName>: { ... }, <more entities> }
	 * 
	 * But instead has to be
	 * 
	 * [ {name: <entityName>, ... }, <more entities> ]	
	 * 
	 * -----------------------------------------------------------------
	 * 
	 * ENTRY-FORMAT:
	 * 
	 * %name%: {
	 *    type: "property" | "entity"
	 *    components: ["%component1%" ,...]
	 *    parent: "%parent_entity%"
	 *    family: ["%property-family1%", ...]
	 *    properties: { key1:value1, ... }
	 *    source: { url:"%file%", line:sourceLine, (your data) }
	 *    isStatic: true|false
	 * }
	 * 
	 * Not all elements are mandatory. It depends on
	 * what you want to define.
	 * 
	 * For an Entity are required
	 * - components
	 * - properties
	 * 
	 * Type is expected to be "entity" if not provided.
	 * 
	 * To define a Property-Entry you have to specify
	 * the type, properties and may NOT set components.
	 * 
	 * The "source" element is optional. It allows you
	 * to put details about the origin of the entry. If
	 * you have lots of definition files and have an error
	 * it is helpful to know in wich file it occured and where.
	 * In case of a data-base approach an table-name and/or
	 * id might be helpful. 
	 * 
	 * Call getEntityDefinitions to obtain the definitions.
	 * To be able to use the properties inject the result into
	 * an EntityFactory object.
	 * 
	 * This class does perform a merge of the provided source
	 * but does NOT evaluatre nor checks the given properties.	 
	 * 
	 * @returns {EntityDefinitionParserJson}	 
	 */
	function EntityDefinitionParserJson() {
        /** 
		 * created entity this._definitions 
		 * @private
		 **/
		this._definitions = {};
		/** 
		 * json definition 
		 * @private
		 **/
		this._sources = [];
		/** @private */
		this._parsed = false;
	};	
	
	EntityDefinitionParserJson.prototype = {		
		getParseResult: function() {
			return this._parseResult;
		},		
        /** 
         * add json def 
         * 
         * @param {mixed} jsonDefinition object-data or json string
         **/
        addSource: function(jsonDefinition) {
            if (typeof jsonDefinition === "string")            
                jsonDefinition = JSON.parse(jsonDefinition);            
            
            this._sources.push(jsonDefinition);
            this._parsed = false;
        },          
        /**
         * 
         * @param {mixed} def optional
         * @returns {Array}
         */
        getEntityDefinition: function(def) {
            if (def)
                this.addSource(def);
            if (!this._parsed)
                this.parse();            
            return this._definitions;
        },        
        /** 
		 * pases all json this._definitions 
		 **/ 
        parse: function(logger) {   
            logger = logger || console;            
            this._definitions = {};
            if (this._sources.length === 0)
                return;               
            var combined = this._combineSources();
            for (var entityName in combined)  {
                var entityData = combined[entityName];                                                               
                if (this._definitions.hasOwnProperty(entityName)) {
                    logger.error("Found multiple Entity-Entry. \"" + entityName + "\" is used more than once. Second entry is ignored.");
                    continue;
                }
                var i, len;                
                var isStatic = false;
                var parent = null;
                var properties = {};
                var components = [];
                var family = [];
                var type = "entity";
				var source = {};
				var interiaOk = true;
                for (var interia in entityData) {
                    var value = entityData[interia];                    
                    switch (interia) {
                        case "static":
                            isStatic = value;
                            break;
                        case "type":
                            if (!env.checkEnumNoCase(value, ["Entity", "Property"])) {
                                logger.error("Unknown type in Entity \"" + entityName + "\". Type: \"" + value + "\"");
								interiaOk = false;
                                continue;
                            }                        
                            type = value.toLowerCase();                        
                            break;
                        case "parent":                           
                            value = "" + value;
                            value = value.toLowerCase();
                            parent = value;
                            break;
                        case "family":
                            if (!env.isArray(value)) {
                                logger.error("Error in Entity \"" + entityName + "\". Family is expected to be an Array.");
								interiaOk = false;
                                continue;
                            }
                            len = value.length;
                            var familyEntryOk = true;
                            for (i=0; i<len; i++) {								
                                var familyEntry = value[i];
                                familyEntry = familyEntry.toLowerCase();
                                family.push(familyEntry);
                            }
                            if (!familyEntryOk) {
								interiaOk = false;
                                continue;                                                        
							}
                            break;
                        case "components":
                            if (!env.isArray(value)) {
                                logger.error("Error in Entity \"" + entityName + "\". Components is expected to be an Array. Found " + typeof(value));
								interiaOk = false;
                                continue;
                            }
                            len = value.length;
                            for (i=0; i<len; i++)
                                components.push(value[i]);
                            break;
                        case "properties":
                            for (var key in value)                            
                                properties[key] = value[key];
                            
                            break;
						case "source":
                            source = value;
                            break;
                        default:
                            logger.log("Warning in Entity \"" + entityName + "\". Unknown element \""+ interia +"\"");
                            break;
                    }                    
					if (!interiaOk)
						break;
                }                
                if (!interiaOk)
					continue;                
                // check integrity
                if (type !== "entity" &&
                    components.length > 0) {
                    logger.error("Error in Entity \"" + entityName + "\". Only Entity may contain components.");
                    continue;
                }                               
                // set own components
				var newDefinition = new EntityDefinition();
                newDefinition.components = components;                    
                newDefinition.properties = env.combineObjects({}, properties);
                newDefinition.family = family;
                newDefinition.isStatic = isStatic;
                newDefinition.name = entityName;
                newDefinition.type = type;
                newDefinition.parent = parent;
                newDefinition.source = source;
                // store
                this._definitions[entityName.toLowerCase()] = newDefinition;
            }            
            this._parsed = true;
        },
		/**		 
		 * @private
		 */
		_combineSources: function() {			
			// TODO this section needs to be rewritten!			
			if (this._sources.length === 1)
				return this._sources[0];                
			var len;
			var result = this._sources[0];
			len = this._sources.length;
			for (var i=1; i<len; i++)        
				result = env.combineObjects(result, this._sources[i]);
			return result;
		}
		
		
		/*
		 * 
		 * 
		 * lodash combined with jQuery.extend should solve the issue
		 * 
		
			var x1 = [
				{	name: "Witch",
					components: [
						"AlwaysActive",                
						"FxNode",
						"Sprite",            
						"WitchOnScreen",
						"PositionApproacher",
						"Figure"
					],
					properties: {
						spriteSheetUrl: "assets/sprites/witch.json",
						startAnim: "fly"
					}
				},
				{
					name: "FishKopp",
					properties: {yeah: true}
				}
				
			];
			
			
			var x2 = [
				{	name: "Witch",
					components: [
						"Sega"
					],
					properties: {
						isUgly: true,
						startAnim: "superfly"
					}
				},
				{
					name: "LadyGaga"
					
				},
				{
					name: "FishKopp",
					properties: {yeah: true}
				}
			];
			
			
			var xx1 = _.groupBy(x1, function(x) {return x.name});
			var xx2 = _.groupBy(x2, function(x) {return x.name});
			
			var sources = [xx1, xx2];
			var len = sources.length;
			var res = xx1;
			for (var i=1; i<len; i++) {				
				var newRes = {};
				$.extend(true, newRes, res, sources[i]);
				res = newRes;
			}
			
			console.log(res);*/		
		
    };
	
	return EntityDefinitionParserJson;

});
