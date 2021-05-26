/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2013, Christoph Schnackenberg <bluechs@gmx.de>
 * Copyright (c) 2013, Johannes Brosi <mail@jbrosi.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 */
define(["require", "exports"], function (require, exports) {
    // define([], function () {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LayerModel = void 0;
    /**
     * Defines a layer model
     *
     * @constructor
     */
    function LayerModel() {
        this._width = 0;
        this._height = 0;
        this._tileWidth = 0;
        this._tileHeight = 0;
        this._tileIds = [];
        this._name = "";
    }
    exports.LayerModel = LayerModel;
    LayerModel.prototype = {
        initialize: function (name, width, height, tileWidth, tileHeight, tileIds) {
            this._name = name;
            this._width = width;
            this._height = height;
            this._tileWidth = tileWidth;
            this._tileHeight = tileHeight;
            this._tileIds = tileIds;
            this._tileCount = width * height;
        },
        getTileCount: function () {
            return this._tileCount;
        },
        getWidth: function () {
            return this._width;
        },
        getHeight: function () {
            return this._height;
        },
        getName: function () {
            return this._name;
        },
        getTileWidth: function () {
            return this._tileWidth;
        },
        getTileHeight: function () {
            return this._tileHeight;
        },
        getTileIds: function () {
            return this._tileIds;
        },
        getTileId: function (x, y, isSeemless) {
            if (isSeemless) {
                //we're seemless just repeat the last numbers if we're out of bounds
                if (x < 0) {
                    x = 0;
                }
                else if (x >= this.getWidth()) {
                    x = this.getWidth() - 1;
                }
                if (y < 0) {
                    y = 0;
                }
                else if (y >= this.getHeight()) {
                    y = this.getHeight() - 1;
                }
            }
            else {
                //we're not seemless so just return -1 if we're out of bounds
                if (x >= this.getWidth() || x < 0 || y >= this.getHeight() || y < 0) {
                    return -1;
                }
            }
            //we should be in bounds here
            return this._tileIds[y * this.getWidth() + x];
        }
    };
});
//     return LayerModel;
// });
//# sourceMappingURL=LayerModel.js.map