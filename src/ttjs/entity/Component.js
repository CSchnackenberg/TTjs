define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Component = void 0;
    /**
     * @class BaseClass for components
     *
     **/
    class Component {
        constructor() {
            this.entity = null;
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
        onDispose(entity) {
        }
    }
    exports.Component = Component;
});
//# sourceMappingURL=Component.js.map