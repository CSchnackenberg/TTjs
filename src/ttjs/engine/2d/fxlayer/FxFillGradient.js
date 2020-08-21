/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2013, Christoph Schnackenberg <bluechs@gmx.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 */
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
define(["require", "exports", "@ttjs/engine/2d/fxlayer/FxLayer", "@ttjs/util/TTTools", "@ttjs/lib/easeljs"], function (require, exports, FxLayer_1, TTTools_1, Fx) {
    "use strict";
    exports.__esModule = true;
    exports.FxFillGradient = void 0;
    "use strict";
    function FxFillGradient(canvas) {
        FxLayer_1.FxLayer.call(this); // < super()
        this.stage = new Fx.Stage(canvas);
        Fx.Touch.enable(this.stage);
        this.stage.autoClear = false;
        if (!this.shape) {
            this.shape = new Fx.Shape();
            this.shape.graphics.beginLinearGradientFill(["rgba(0,0,0,0)", "rgba(255,128,0,1)"], [0, 1], 0, 0, 0, canvas.height).drawRect(0, 0, canvas.width, canvas.height);
            this.stage.addChild(this.shape);
            this.stage.cache(0, 0, canvas.width, canvas.height);
        }
    }
    exports.FxFillGradient = FxFillGradient;
    ;
    TTTools_1.TTTools.inherits(FxFillGradient, FxLayer_1.FxLayer);
    FxFillGradient.prototype._drawLayer = function (fxWorld) {
        this.stage.update();
    };
});
// 	return FxFillGradient;
// });
//# sourceMappingURL=FxFillGradient.js.map