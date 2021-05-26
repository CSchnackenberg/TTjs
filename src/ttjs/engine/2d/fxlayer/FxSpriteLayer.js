define(["require", "exports", "@ttjs/engine/2d/fxlayer/FxLayer", "@ttjs/lib/easeljs", "@ttjs/util/TTTools"], function (require, exports, FxLayer_1, Fx, TTTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FxSpriteLayer = void 0;
    // define([
    // 	'ttjs/util/TTTools',
    //     'ttjs/engine/2d/fxlayer/FxLayer',
    //     'ttjs/lib/easeljs'
    // ], function(
    //     env,
    //     FxLayer,
    //     Fx
    // )
    // {
    "use strict";
    function FxSpriteLayer(canvas) {
        FxLayer_1.FxLayer.call(this); // < super()
        this.stage = new Fx.Stage(canvas);
        Fx.Touch.enable(this.stage);
        this.stage.autoClear = false;
        this._root = new Fx.Container();
        this.stage.addChild(this._root);
    }
    exports.FxSpriteLayer = FxSpriteLayer;
    ;
    TTTools_1.TTTools.inherits(FxSpriteLayer, FxLayer_1.FxLayer);
    FxSpriteLayer.prototype._drawLayer = function (fxWorld) {
        var vp = this._calcViewport(fxWorld);
        this._root.x = -vp.x;
        this._root.y = -vp.y;
        this.stage.update();
    };
    FxSpriteLayer.prototype.getRoot = function () {
        return this._root;
    };
});
// 	return FxSpriteLayer;
// });
//# sourceMappingURL=FxSpriteLayer.js.map