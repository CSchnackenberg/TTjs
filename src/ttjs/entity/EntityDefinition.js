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
define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.EntityDefinition = void 0;
    /** @class  */
    function EntityDefinition() {
        /** @type bool static entites are always instantiated */
        this.isStatic = false;
        /** @type String */
        this.name = "";
        /** @type Array */
        this.components = [];
        /**  */
        this.parent = null;
        /** property family */
        this.family = [];
        /** unparsed properties */
        this.properties = {};
        /** information about the definition origin */
        this.source = {};
    }
    exports.EntityDefinition = EntityDefinition;
});
//     return EntityDefinition;
// });
//# sourceMappingURL=EntityDefinition.js.map