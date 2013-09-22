/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2013, Johannes Brosi <mail@jbrosi.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 */

define([], function () {

    "use strict";
    function TileLayerRenderer() {
        this.cacheCanvas = {};
        this.cacheContext = {};
        this.lastTileOffset = {};
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

        initializeCacheCanvas: function (layerIndex, width, height) {
            this.cacheCanvas[layerIndex] = document.createElement('canvas');
            this.cacheCanvas[layerIndex].setAttribute('width', width);
            this.cacheCanvas[layerIndex].setAttribute('height', height);
            this.cacheContext[layerIndex] = this.cacheCanvas[layerIndex].getContext("2d");
        },

        /* draws the layer */
        drawLayer: function (
            context,
            mapInfo,
            layerIndex,
            position
        ) {

            var currentLayer = mapInfo.getLayer(layerIndex),
                tileWidth = currentLayer.getTileWidth(),
                tileHeight = currentLayer.getTileHeight(),
                tileOffset;

            if (this.cacheContext[layerIndex] === undefined) {
                this.initializeCacheCanvas(layerIndex, context.canvas.width + (2 * tileWidth), context.canvas.height + (2 * tileHeight));
                return;
            }

            tileOffset = {
                x: Math.floor(position.src.x / tileWidth),
                y: Math.floor(position.src.y / tileHeight),
                pX: -Math.floor(position.src.x % tileWidth),
                pY: -Math.floor(position.src.y % tileHeight)
            };


            if (this.lastTileOffset[layerIndex] === undefined || tileOffset.x !== this.lastTileOffset[layerIndex].x || tileOffset.y !== this.lastTileOffset[layerIndex].y) {
                //redraw needed
                this.redraw(this.cacheContext[layerIndex], mapInfo, layerIndex, position);
            }

            context.drawImage(this.cacheCanvas[layerIndex], -tileOffset.pX, -tileOffset.pY, context.canvas.width, context.canvas.height, 0, 0, context.canvas.width, context.canvas.height);

            this.lastTileOffset[layerIndex] = tileOffset;

            //blit cacheCanvas to original:

        },


        redraw: function (
            context,
            mapInfo,
            layerIndex,
            position
        ) {


            var currentLayer = mapInfo.getLayer(layerIndex),
                tileWidth = currentLayer.getTileWidth(),
                tileHeight = currentLayer.getTileHeight(),
                rangeX = (context.canvas.width - position.dest.x) / tileWidth,
                rangeY = (context.canvas.height - position.dest.y) / tileHeight,
                pX,
                pY,
                tileOffset,
                x,
                y,
                tileId,
                tileSet,
                iBounds;

            if (rangeX <= 0 || rangeY <= 0) {
                //nothing to do
                return;
            }

            tileOffset = {
                x: Math.floor(position.src.x / tileWidth),
                y: Math.floor(position.src.y / tileHeight)
            };

            if (tileOffset.pX !== 0) {
                rangeX++;
            }
            if (tileOffset.pY !== 0) {
                rangeY++;
            }

            context.clearRect(0, 0, context.canvas.width, context.canvas.height);

            for (y = 0; y < rangeY; y++) {
                for (x = 0; x < rangeX; x++) {
                    pX = position.dest.x + (tileWidth * x);
                    pY = position.dest.y + (tileHeight * y);

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