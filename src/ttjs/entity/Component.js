define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.Component = void 0;
    /**
     * @class BaseClass for components
     *
     **/
    var Component = /** @class */ (function () {
        function Component() {
            this.entity = null;
            /** @type Entity link to the owner entity */
            this.entity = null;
        }
        /** Send a message to all entity components */
        Component.prototype.sendMessageToEntity = function (name, params) {
            this.entity.sendMessage(name, params);
        };
        /** Send a message to all active entities */
        Component.prototype.sendMessageToActive = function (name, params) {
            this.entity.manager.sendMessage(name, params, true);
        };
        /**
         * Send a message to all entities.
         *
         * This should be used with caution as there may be thousends
         * of entities to crawl.
         **/
        Component.prototype.sendMessageToAll = function (name, params) {
            this.entity.manager.sendMessage(name, params, false);
        };
        /**
         * Finds a component within this entitiy.
         *
         * @param {String} cmpName Class-Name of the component
         **/
        Component.prototype.findComponent = function (cmpName) {
            return this.entity.findComponent(cmpName);
        };
        Component.prototype.onDispose = function (entity) {
        };
        return Component;
    }());
    exports.Component = Component;
});
//# sourceMappingURL=Component.js.map