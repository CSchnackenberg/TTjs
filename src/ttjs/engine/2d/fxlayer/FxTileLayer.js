define(["require", "exports", "@ttjs/engine/2d/fxlayer/FxLayer", "@ttjs/util/TTTools"], function (require, exports, FxLayer_1, TTTools_1) {
    "use strict";
    exports.__esModule = true;
    exports.FxTileLayer = void 0;
    // define([
    // 	'ttjs/util/TTTools',
    //     'ttjs/engine/2d/fxlayer/FxLayer'
    // ], function(
    //     env,
    //     FxLayer
    // )
    // {
    "use strict";
    function FxTileLayer(layerModel, layerIndex) {
        FxLayer_1.FxLayer.call(this); // < super()
        this.layerModel = layerModel;
        this.layerIndex = layerIndex;
        this.position = {
            dest: {
                x: 0,
                y: 0
            },
            src: {
                x: 0,
                y: 0
            },
            seemless: {
                x: true,
                y: true
            }
        };
    }
    exports.FxTileLayer = FxTileLayer;
    ;
    TTTools_1.TTTools.inherits(FxTileLayer, FxLayer_1.FxLayer);
    FxTileLayer.prototype._drawLayer = function (fxWorld) {
        var vp = this._calcViewport(fxWorld);
        this.position.src.x = Math.floor(vp.x);
        this.position.src.y = Math.floor(vp.y);
        fxWorld.tileRenderer.drawLayer(fxWorld.ctx, fxWorld.mapRenderModel, this.layerIndex, this.position);
    };
});
// 	return FxTileLayer;
// });
//# sourceMappingURL=FxTileLayer.js.map