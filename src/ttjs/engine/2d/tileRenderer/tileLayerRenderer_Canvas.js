/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2013, Christoph Schnackenberg <bluechs@gmx.de>
 * Copyright (c) 2013, Johannes Brosi <mail@jbrosi.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 */

define([], function () {
    "use strict";
    function TileLayerRenderer() {
    }

    TileLayerRenderer.prototype = {


        /** draws the layer */
        drawLayerScaled: function (
            destContext,
            layerIndex,
            destx,
            desty,
            destw,
            desth,
            srcx,
            srcy,
            srcw,
            srch,
            seamlessX,
            seamlessY
        ) {},

        /* draws the layer */
        drawLayer: function (
            context,
            mapInfo,
            layerIndex,
            position
        ) {
            //start at destx, desty and draw layer[layerIndex] till the full context width/height is filled.

            var currentLayer = mapInfo.getLayer(layerIndex),
                tileWidth = currentLayer.getTileWidth(),
                tileHeight = currentLayer.getTileHeight(),
                rangeX = (context.canvas.width - position.dest.x) / tileWidth,
                rangeY = (context.canvas.height - position.dest.y) / tileHeight,
                tileOffset,
                x,
                y,
                pX,
                pY,
                iBounds,
                tileId,
                tileSet;


            if (rangeX <= 0 || rangeY <= 0) {
                //nothing to do
                return;
            }

            tileOffset = {
                x: Math.floor(position.src.x / tileWidth),
                y: Math.floor(position.src.y / tileHeight),
                pX: -Math.floor(position.src.x % tileWidth),
                pY: -Math.floor(position.src.y % tileHeight)
            };

            if (tileOffset.pX !== 0) {
                rangeX++;
            }
            if (tileOffset.pY !== 0) {
                rangeY++;
            }

            for (y = 0; y < rangeY; y++) {
                for (x = 0; x < rangeX; x++) {
                    pX = tileOffset.pX + position.dest.x + (tileWidth * x);
                    pY = tileOffset.pY + position.dest.y + (tileHeight * y);

                    tileId = currentLayer.getTileId(tileOffset.x + x, tileOffset.y + y);


                    tileSet = mapInfo.resolveTileSet(tileId);
                    if (tileSet !== undefined) {
                        iBounds = tileSet.getImageBounds(tileId);
                        context.drawImage(tileSet.getImageElement(), iBounds.x, iBounds.y, iBounds.width, iBounds.height, pX, pY, iBounds.width, iBounds.height);
                    }
                }
            }
        }
    };

    return TileLayerRenderer;
});