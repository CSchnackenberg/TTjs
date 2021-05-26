/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2013, Christoph Schnackenberg <bluechs@gmx.de>
 * Copyright (c) 2013, Johannes Brosi <mail@jbrosi.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 */
define(["require", "exports", "@ttjs/util/TTTools", "@ttjs/lib/lodash", "@ttjs/entity/ComponentManager", "@ttjs/entity/parser/NumberPropertyParser", "@ttjs/entity/parser/StringPropertyParser", "@ttjs/entity/parser/EnumPropertyParser", "@ttjs/entity/parser/NumberEnumPropertyParser", "@ttjs/entity/parser/AnyPropertyParser", "@ttjs/entity/parser/EaseFuncPropertyParser", "@ttjs/entity/ResourceManager", "@ttjs/entity/EntityInstance", "@ttjs/entity/EntityLinker"], function (require, exports, TTTools_1, _, ComponentManager_1, NumberPropertyParser_1, StringPropertyParser_1, EnumPropertyParser_1, NumberEnumPropertyParser_1, AnyPropertyParser_1, EaseFuncPropertyParser_1, ResourceManager_1, EntityInstance_1, EntityLinker_1) {
    "use strict";
    exports.__esModule = true;
    exports.EntityFactory = void 0;
    /**
     * @class
     *
     * @param {ResourceManager} resourceManager description
     * @returns {EntityFactory}
     */
    function EntityFactory(resourceManager) {
        this._linkedDefinitions = {};
        this._linker = new EntityLinker_1.EntityLinker();
        this._resourceManager = resourceManager || new ResourceManager_1.ResourceManager();
        this.nextEntityId = 1;
        // default parser
        this._propertyParser = {
            "number": new NumberPropertyParser_1.NumberPropertyParser(),
            "string": new StringPropertyParser_1.StringPropertyParser(),
            "enum": new EnumPropertyParser_1.EnumPropertyParser(),
            "numberEnum": new NumberEnumPropertyParser_1.NumberEnumPropertyParser(),
            "ease": new EaseFuncPropertyParser_1.EaseFuncPropertyParser(),
            "any": new AnyPropertyParser_1.AnyPropertyParser(),
        };
    }
    exports.EntityFactory = EntityFactory;
    EntityFactory.prototype = {
        addDefinitions: function (defs) {
            this._linker.addDefinitions(defs);
        },
        /**
         * This function loads all data that is required for the
         * provided entities.
         *
         * @param {mixed} entityInstances array or EntityInstance object
         * @param {function} onReady called when all data is prepared
         */
        preloadEntities: function (entityInstances, onReady, logger, depth) {
            depth = depth || 0;
            if (!this._linker.linked) {
                this._linkedDefinitions = this._linker.link(logger);
            }
            if (!_.isArray(entityInstances))
                entityInstances = [entityInstances];
            if (depth > 20) {
                logger.error("Entity-Child requirement seems to loop. Recursion exceeded 20");
                onReady([]);
                return;
            }
            // STEPS:
            // 1) Load all component-classes for all instances
            // 2) Check component requirements
            // 3) Parse all properties
            // 4) Call for each instance and for each component
            //    with the parsed properties the Resource-Request
            //    method. Requested children are collected as additional
            //    EntityInstances.
            // 5.a) If we have child-instances we call this function
            //      again with the children.
            // 5.b) If no children are needed we are done and can
            //      perform the callback
            //
            // Return (via callback) instance-able entities (including prased properties)
            // instances we can work with
            var i, i2, len, len2;
            var validInstances = [];
            var componentList = [];
            // STEP 1
            len = entityInstances.length;
            for (i = 0; i < len; i++) {
                var instance = entityInstances[i];
                var entitySearchName = instance.entityDefinitionName.toLowerCase();
                var def = this._linkedDefinitions[entitySearchName];
                if (!def) {
                    logger.error("Cannot find Entity: " + instance.entityDefinitionName);
                    continue;
                }
                if (def.type !== "entity") {
                    logger.error("Cannot load Entity: " + instance.entityDefinitionName + ". Type not compatible.");
                    continue;
                }
                if (!(def.components.length > 0)) {
                    logger.error("Cannot load Entity: " + instance.entityDefinitionName + ". Has no components.");
                    continue;
                }
                // collect all components
                len2 = def.components.length;
                for (i2 = 0; i2 < len2; i2++)
                    componentList.push(def.components[i2]);
                // work able
                validInstances.push(instance);
            }
            // Load components
            var thiz = this;
            ComponentManager_1.ComponentManager.require(componentList, function () {
                // check all instances again
                var oldValidInstances = validInstances;
                validInstances = [];
                len = oldValidInstances.length;
                for (i = 0; i < len; i++) {
                    instance = oldValidInstances[i];
                    def = thiz._linkedDefinitions[instance.entityDefinitionName.toLowerCase()];
                    // collect all components
                    len2 = def.components.length;
                    var stateOk = true;
                    var stateErr = "";
                    for (i2 = 0; i2 < len2; i2++) {
                        var cmpState = ComponentManager_1.ComponentManager.getState(def.components[i2]);
                        switch (cmpState) {
                            case "ready":
                                break;
                            default:
                                stateOk = false;
                                stateErr = "Bad component state: " + cmpState;
                                break;
                        }
                        if (!stateOk)
                            break;
                    }
                    if (!stateOk) {
                        logger.error("Cannot load Entity: " + instance.entityDefinitionName + ". " + stateErr);
                        continue;
                    }
                    validInstances.push(instance);
                }
                // STEP 2
                oldValidInstances = validInstances;
                validInstances = [];
                len = oldValidInstances.length;
                for (i = 0; i < len; i++) {
                    instance = oldValidInstances[i];
                    def = thiz._linkedDefinitions[instance.entityDefinitionName.toLowerCase()];
                    len2 = def.components.length;
                    var incompleteEntity = false;
                    var missingCmp = "";
                    var componentClasses = [];
                    var componentNames = [];
                    for (i2 = 0; i2 < len2 && !incompleteEntity; i2++) {
                        var cmpName = def.components[i2];
                        var cmpClass = ComponentManager_1.ComponentManager.getClass(cmpName);
                        var cmpSetup = cmpClass.requires;
                        componentClasses.push(cmpClass);
                        componentNames.push(cmpName);
                        // resource callback
                        if (cmpSetup && _.isArray(cmpSetup.cmps)) {
                            var len3 = cmpSetup.cmps.length;
                            for (var i3 = 0; i3 < len3; i3++) {
                                if (!_.contains(def.components, cmpSetup.cmps[i3])) {
                                    incompleteEntity = true;
                                    missingCmp = cmpSetup.cmps[i3];
                                    break;
                                }
                            }
                        }
                    }
                    if (incompleteEntity) {
                        logger.error("Incomplete entity \"" + instance.entityDefinitionName + "\". Component \"" + cmpName + '" requires component "' + missingCmp + '".');
                        continue;
                    }
                    instance.parsedProperties = parsedProperties;
                    instance.componentClasses = componentClasses;
                    instance.componentClassNames = componentNames;
                    validInstances.push(instance);
                }
                // STEP 3
                oldValidInstances = validInstances;
                validInstances = [];
                len = oldValidInstances.length;
                for (i = 0; i < len; i++) {
                    instance = oldValidInstances[i];
                    def = thiz._linkedDefinitions[instance.entityDefinitionName.toLowerCase()];
                    var rawEntityProperties = TTTools_1.TTTools.combineObjects(def.properties, instance.instanceProperties);
                    var parsedProperties = thiz._parseProperties(thiz, def, rawEntityProperties, instance.entityDefinitionName, logger);
                    if (!parsedProperties)
                        continue;
                    instance.parsedProperties = parsedProperties;
                    validInstances.push(instance);
                }
                // STEP 4
                oldValidInstances = validInstances;
                validInstances = [];
                len = oldValidInstances.length;
                var requiredResources = [];
                var errorInCmpRes = false;
                for (i = 0; i < len; i++) { // each Entity
                    instance = oldValidInstances[i];
                    instance.expectedResources = [];
                    def = thiz._linkedDefinitions[instance.entityDefinitionName.toLowerCase()];
                    len2 = def.components.length;
                    errorInCmpRes = false;
                    for (i2 = 0; i2 < len2 && !errorInCmpRes; i2++) {
                        var cmpName = def.components[i2];
                        var cmpClass = ComponentManager_1.ComponentManager.getClass(cmpName);
                        var cmpSetup = cmpClass.requires;
                        // resource callback
                        if (cmpSetup && _.isFunction(cmpSetup.res)) {
                            var req = cmpSetup.res(instance.parsedProperties);
                            if (_.isArray(req)) {
                                var req = thiz._unifyResourceProperties(thiz, req);
                                if (_.isString(req)) {
                                    logger.error("Error in component: \"" + cmpName + "\" in entity \"" + instance.entityDefinitionName + '". Resource requirement failed with "' + req + '".');
                                    errorInCmpRes = true;
                                    continue;
                                }
                                else {
                                    instance.expectedResources.push.apply(instance.expectedResources, req);
                                }
                            }
                        }
                    }
                    if (!errorInCmpRes) {
                        requiredResources.push.apply(requiredResources, instance.expectedResources);
                        validInstances.push(instance);
                    }
                }
                // STEP 5.a
                len = validInstances.length;
                var requiredChildren = [];
                for (i = 0; i < len; i++) { // each Entity
                    instance = validInstances[i];
                    def = thiz._linkedDefinitions[instance.entityDefinitionName.toLowerCase()];
                    len2 = def.components.length;
                    for (i2 = 0; i2 < len2 && !errorInCmpRes; i2++) {
                        var cmpName = def.components[i2];
                        var cmpClass = ComponentManager_1.ComponentManager.getClass(cmpName);
                        var cmpSetup = cmpClass.requires;
                        // resource callback
                        if (cmpSetup && _.isFunction(cmpSetup.children)) {
                            var children = cmpSetup.children(instance.parsedProperties);
                            if (_.isArray(children)) {
                                len3 = children.length;
                                for (i3 = 0; i3 < len3; i3++) {
                                    var childProps = instance.instanceProperties[children[i3]] || {};
                                    //console.warn(instance.instanceProperties, childProps);
                                    var dummyChildEntity = new EntityInstance_1.EntityInstance("", children[i3], {}, childProps);
                                    requiredChildren.push(dummyChildEntity);
                                }
                            }
                        }
                    }
                }
                if (requiredResources.length === 0) {
                    // STEP 5.b
                    if (requiredChildren.length > 0) {
                        //console.log("Request children ", requiredChildren);
                        thiz.preloadEntities(requiredChildren, function (childStuff) {
                            //console.log("Children results", childStuff);
                            onReady(validInstances);
                        }, logger, depth + 1);
                    }
                    else {
                        onReady(validInstances);
                    }
                    return;
                }
                // load resources
                thiz._resourceManager.request(requiredResources, function () {
                    // all data loaded
                    // Now we check if all data is loaded for each
                    // entity.
                    oldValidInstances = validInstances;
                    validInstances = [];
                    len = oldValidInstances.length;
                    for (i = 0; i < len; i++) {
                        instance = oldValidInstances[i];
                        instance.id = thiz.nextEntityId++;
                        len2 = instance.expectedResources.length;
                        var allResourcesLoaded = true;
                        for (i2 = 0; i2 < len2; i2++) {
                            var type = instance.expectedResources[i2].type;
                            var url = instance.expectedResources[i2].url;
                            if (!thiz._resourceManager.isResourceLoaded(type, url)) {
                                allResourcesLoaded = false;
                                logger.error("Cannot load Entity:", instance.entityDefinitionName, ". Required resource", url, "was not loaded. Issue:", thiz._resourceManager.getResourceError(type, url));
                            }
                        }
                        if (allResourcesLoaded)
                            validInstances.push(instance);
                    }
                    // STEP 5.b
                    if (requiredChildren.length > 0) {
                        //console.log("Request children ", requiredChildren);
                        thiz.preloadEntities(requiredChildren, function (childStuff) {
                            //console.log("Children results", childStuff);
                            onReady(validInstances);
                        }, logger, depth + 1);
                    }
                    else {
                        // we are done :)
                        onReady(validInstances);
                    }
                });
            });
        },
        /**
         * uniforms resource parameter
         *
         * @param {type} thiz
         * @param {type} req
         * @returns {mixed} object or error-string in case of a problem
         */
        _unifyResourceProperties: function (thiz, req) {
            // Resources can be provided in different formats.
            //
            // 1) Array
            //    If the resource-value is provided as an array
            //    it is assumed that
            //    INDEX: 0 is the resource type
            //    INDEX: 1 is the url of the resource
            // 2) String
            //    A string is the shortest form. The developer
            //    can provide both resource type and url
            //    in one. To do so the string must be formated
            //    like this:
            //    <resource-type>!<resource-url>
            //    e.g. "jsImage!assets/graphics/sprites/spr42.png"
            //
            //    If the resource type is not encoded in the string
            //    the resource manager will select the type by
            //    the file-ending. This is recommended for types
            //    that cannot be missinterpreted (e.g. ogg).
            // 3) Object
            //    Object expects the following key-words:
            //    type:String   resource type
            //    url:String    link to the url
            //
            var retVal = [];
            var tempType;
            _.forEach(req, function (rawResourceDesc, index) {
                if (_.isArray(rawResourceDesc)) {
                    retVal.push({
                        'type': rawResourceDesc[0],
                        'url': rawResourceDesc[1]
                    });
                }
                else if (_.isString(rawResourceDesc)) {
                    if (rawResourceDesc.indexOf('!') !== -1) {
                        var parts = rawResourceDesc.split('!');
                        retVal.push({
                            'type': parts[0],
                            'url': parts[1]
                        });
                    }
                    else {
                        tempType = thiz._resourceManager.detectResourceType(rawResourceDesc);
                        if (tempType === false) {
                            retVal = "Cannot select resource type by url '" + rawResourceDesc + "'";
                            return false;
                        }
                        else if (tempType === true) {
                            retVal = "Cannot select resource type by url '" + rawResourceDesc + "'. Multiple resource manager can handle the given type.";
                            return false;
                        }
                        if (_.isEmpty(tempType) ||
                            _.isEmpty(rawResourceDesc)) {
                            retVal = "Url or type are undefined/empty. url: '" + rawResourceDesc + "' type:'" + tempType + "'";
                            return false;
                        }
                        retVal.push({
                            'type': tempType,
                            'url': rawResourceDesc
                        });
                    }
                }
                else if (!_.isPlainObject(rawResourceDesc) ||
                    !rawResourceDesc.hasOwnProperty('type') ||
                    !rawResourceDesc.hasOwnProperty('url')) {
                    retVal = "object with 'type' and/or 'url' is missing.";
                    return false;
                }
                else {
                    retVal.push({
                        'type': rawResourceDesc.type,
                        'url': rawResourceDesc.url
                    });
                }
            });
            if (_.isEmpty(retVal))
                return "No request data was found";
            return retVal;
        },
        /**
         *
         * @private
         * @returns {mixed} object: all properties parsed. undefined: error
         */
        _parseProperties: function (thiz, def, rawProps, entityName, logger) {
            var res = {};
            var rawProp;
            var i, len;
            len = def.components.length;
            for (i = 0; i < len; i++) {
                var cmpName = def.components[i];
                var cmpClass = ComponentManager_1.ComponentManager.getClass(cmpName); // window[cmpName];
                var cmpSetup = cmpClass.requires;
                // **  NEEDED PROPERTIES **
                if (cmpSetup && cmpSetup.need) {
                    for (var need in cmpSetup.need) {
                        var needInfo = cmpSetup.need[need];
                        // some convinience
                        if (typeof (needInfo) === "string")
                            needInfo = { type: needInfo };
                        if (typeof (needInfo) !== "object") {
                            logger.warn("Warning in Entity: " + entityName + " with components \"" + cmpName + "\". Property requirement must be string or object.");
                            continue;
                        }
                        if (!rawProps.hasOwnProperty(need)) {
                            logger.error("Cannot spawn Entity: " + entityName + " with components \"" + cmpName + "\". Required Property \"" + need + "\" with type \"" + needInfo.type + "\" is not provided.");
                            return;
                        }
                        rawProp = rawProps[need];
                        var type = needInfo.type.toLowerCase();
                        var parser = this._propertyParser[type];
                        if (!parser) {
                            logger.error("Cannot spawn Entity: " + entityName + " with components \"" + cmpName + "\". Required Property \"" + need + "\". Unknown type \"" + needInfo.type + "\".");
                            return;
                        }
                        var parserRes = parser.parse(need, needInfo, rawProp, res);
                        if (typeof (parserRes) === "string") {
                            logger.error("Cannot spawn Entity: " + entityName + " with components \"" + cmpName + "\". Required Property \"" + need + "\". " + parserRes);
                            return; // parser found an error
                        }
                        // drop property from list
                        delete rawProps[need];
                    }
                }
                // **  OPTIONAL PROPERTIES **
                if (cmpSetup && cmpSetup.opt) {
                    for (var opt in cmpSetup.opt) {
                        var optInfo = cmpSetup.opt[opt];
                        // some convinience
                        if (TTTools_1.TTTools.isArray(optInfo))
                            optInfo = { type: optInfo[0], def: optInfo[1] };
                        var optType = optInfo.type;
                        var optDef = optInfo.def;
                        if (!_.isPlainObject(optInfo)) {
                            logger.error("Error in component: \"" + cmpName + "\" in entity \"" + entityName + '". Optional Property "' + opt + '" must be an object');
                            return;
                        }
                        if (!_.isString(optType)) {
                            logger.error("Error in component: \"" + cmpName + "\" in entity \"" + entityName + '". Optional Property "' + opt + '" is type undefined');
                            return;
                        }
                        if (_.isUndefined(optDef)) {
                            logger.error("Error in component: \"" + cmpName + "\" in entity \"" + entityName + '". Optional Property "' + opt + '" is missing default value');
                            return;
                        }
                        rawProp = rawProps[opt];
                        if (_.isUndefined(rawProp))
                            rawProp = optDef;
                        parser = this._propertyParser[optType];
                        if (!parser) {
                            logger.error("Error in Entity: " + entityName + " with components \"" + cmpName + "\". Optional Property \"" + opt + "\". Unknown type \"" + optInfo.type + "\".");
                            return;
                        }
                        var parserRes = parser.parse(opt, optInfo, rawProp, res);
                        if (typeof (parserRes) === "string") {
                            logger.error("Error in Entity: " + entityName + " with components \"" + cmpName + "\". Optional Property \"" + opt + "\". " + parserRes);
                            return; // parser found an error
                        }
                        // drop property from list
                        delete rawProps[opt];
                    }
                }
                // SIMPLY COPY THE REST
                // TODO: deep copy!?
                for (var name in rawProps)
                    res[name] = rawProps[name];
            }
            return res;
        }
    };
});
//# sourceMappingURL=EntityFactory.js.map