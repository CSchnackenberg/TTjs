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
    exports.MapRenderModel = void 0;
    function MapRenderModel() {
        this._layers = [];
        this._tileSets = [];
    }
    exports.MapRenderModel = MapRenderModel;
    MapRenderModel.prototype = {
        addLayer: function (layer) {
            this._layers.push(layer);
        },
        addTileSet: function (tileSet) {
            this._tileSets.push(tileSet);
        },
        getLayers: function () {
            return this._layers;
        },
        getLayer: function (index) {
            return this._layers[index];
        },
        getTileSet: function (index) {
            return this._tileSets[index];
        },
        getTileSets: function () {
            return this._tileSets;
        },
        resolveTileSet: function (tileId) {
            if (tileId < 0) {
                return undefined;
            }
            var a, tileSet;
            for (a = 0; a < this._tileSets.length; a++) {
                tileSet = this._tileSets[a];
                if (tileSet.containsId(tileId)) {
                    return tileSet;
                }
            }
            return undefined;
        },
        getLayerIndexByName: function (name) {
            var a;
            for (a = 0; a < this._layers.length; a++) {
                if (this._layers[a].getName() === name) {
                    return a;
                }
            }
            //-1 if not found
            return -1;
        }
    };
});
//     return MapRenderModel;
//
// });
//# sourceMappingURL=MapRenderModel.js.map