/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2013, Christoph Schnackenberg <bluechs@gmx.de>
 * Copyright (c) 2013, Johannes Brosi <mail@jbrosi.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 */

define(["ttjs/util/TTTools"], function (Env) {
    "use strict";
    function TileSetModel() {

        this._tileWidth = 0;
        this._tileHeight = 0;
        this._startId = 0;
        this._amountTilesX = 0;
        this._amountTilesY = 0;
        this._imageWidth = 0;
        this._imageHeight = 0;
        this._amountTilesTotal = 0;
        this._imageElement = new Image();
        this._imageElement = null;
        this._isLoaded = false;
    }

    TileSetModel.prototype = {


        initialize: function (startId, tileWidth, tileHeight, fileName, imageWidth, imageHeight) {
            this._tileWidth = tileWidth;
            this._tileHeight = tileHeight;
            this._imageWidth = imageWidth;
            this._imageHeight = imageHeight;
            this._amountTilesX = imageWidth / tileWidth;
            this._amountTilesY = imageHeight / tileHeight;
            this._amountTilesTotal = this._amountTilesX * this._amountTilesY;
            this._startId = startId;

            fileName = require.toUrl(fileName);

            //console.log(fileName);

            this.setImage(fileName);
        },
        
         initializeWithImage: function (startId, tileWidth, tileHeight, imageElement, imageWidth, imageHeight) {
            this._tileWidth = tileWidth;
            this._tileHeight = tileHeight;
            this._imageWidth = imageWidth;
            this._imageHeight = imageHeight;
            this._amountTilesX = imageWidth / tileWidth;
            this._amountTilesY = imageHeight / tileHeight;
            this._amountTilesTotal = this._amountTilesX * this._amountTilesY;
            this._startId = startId;
            this._isLoaded = true;
            this._imageElement = imageElement
        },

        getImageWidth: function () {
            return this._imageWidth;
        },

        getImageHeight: function () {
            return this._imageHeight;
        },

        setImage: function (fileName) {
            this._isLoaded = false;
            this._imageElement = new Image();
            this._imageElement.onload = Env.proxy(this, this.onImageLoaded);
            this._imageElement.src = fileName;
        },

        getGLTexture: function (gl) {
            if (!this._isLoaded) {
                return 0;
            }
            if (this._glTextureId === null || this._glTextureId === undefined) {
                this._glTextureId = this.createGLTexture(gl);
            }

            return this._glTextureId;
        },

        createGLTexture: function (gl) {

            var textureId = gl.createTexture();
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
            gl.bindTexture(gl.TEXTURE_2D, textureId);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._imageElement);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.bindTexture(gl.TEXTURE_2D, null);
            return textureId;
        },

        containsId: function (id) {
            return this._startId <= id && id < this._startId + this._amountTilesTotal;
        },

        isLoaded: function () {
            return this._isLoaded;
        },

        onImageLoaded: function (event) {
            //console.log("Loaded image", this);
            this._isLoaded = true;
        },

        getTileWidth: function () {
            return this._tileWidth;
        },

        getTileHeight: function () {
            return this._tileHeight;
        },

        getStartId: function () {
            return this._startId;
        },

        getImageElement: function () {
            return this._imageElement;
        },

        getImageBounds: function (tileId) {

            var realTileId = tileId - this._startId,
                imageBounds = {
                    x: 0,
                    y: 0,
                    width: this._tileWidth,
                    height: this._tileHeight
                };

            if (!this.containsId(tileId)) {
                return imageBounds;
            }

//            console.log(realTileId);

            imageBounds.x = (realTileId % this._amountTilesX) * this._tileWidth;
            imageBounds.y = Math.floor(realTileId / this._amountTilesX) * this._tileHeight;


            return imageBounds;
        }
    };

    return TileSetModel;
});