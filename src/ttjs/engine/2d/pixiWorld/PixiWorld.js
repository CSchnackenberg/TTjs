/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2013, Christoph Schnackenberg <bluechs@gmx.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 */
define([
   'PIXI',
   'ttjs/engine/2d/pixiWorld/PixiLayer',
   'ttjs/engine/2d/pixiWorld/PixiFillImageLayer',
   'ttjs/engine/2d/pixiWorld/PixiTileLayer'
], function(
    PIXI,
    PixiLayer,
    PixiFillImageLayer,
    PixiTileLayer
    )
{    
	"use strict";
    
    /**
     * @class Represents a 2D Map, loaded with for PIXI.JS
     * 
     * @constructor
     * @param {type} stage
     * @returns {PixiWorld}
     */
    var PixiWorld = function(stage, stageW, stageH, tiledMapJson) {
        this.stage = stage;
        this._callback = {};
        this.viewport = {
            x: 0,
            y: 0,
            w: stageW,
            h: stageH
        };
        this.map = tiledMapJson;        
        this.root = new PixiLayer("root");
        stage.addChild(this.root.layer);
        this.loaded = false;
    };
    
    PixiWorld.prototype = {                     
        /**
         * Register callbacks 
         * 
         * @param {type} eventName "onSuccess", "onError", "onProgress"
         * @param {type} callback
         * @returns {undefined}
         */
        setCallback: function(callback) {
            this._callback = callback;
        },
        load: function() {           
            if (this.loaded) {
                throw new Error("You cannot load multiple maps with one PixiWorld. Create a new instance!");
            }            
            this.loaded = true; 
            this.pixiAssets = [];            
            this._collectRequiredAssets();
        },
        _collectRequiredAssets: function() {        
            var mapData = this.map;                        
			for (var a = 0; a < mapData.layers.length; a++) {				
				var layerData = mapData.layers[a];				
				if (layerData.visible === false)
					continue;
                if (layerData.image) { // imageLayer
                    var imagePath = this._assetPath(layerData.image);
                    this.pixiAssets.push(imagePath);
                }
				else { // object layer
					var layerName = layerData.name;					                                        
					if (layerName.indexOf(":") > -1)
					{
						var parts = layerName.split(":");
						if (parts.length === 2) {                           
//							if (parts[1] === "sprites") {                                                               
//      						var name = parts[0] || "";
//							}                                                    
						}
					}
				}                        
			}
            for (var b = 0; b < mapData.tilesets.length; b++) {
				var tileSetData = mapData.tilesets[b];				
				var tsImage = this._assetPath(tileSetData.image);
                this.pixiAssets.push(tsImage);
			}
            var that = this;
            this.assetLoader = new PIXI.AssetLoader(this.pixiAssets);
            this.assetLoader.addEventListener('onComplete', function(evt) {                
                if (that._callback.onProgress)
                    that._callback.onProgress("Assets loaded");
                that._initTileSets();
            });
            // TODO add error-handling
            this.assetLoader.load();
        },
        _initTileSets:function() {            
            var tiles = [];
            tiles.push({tex: null, tId: 0});            
            this.tilesets = [];
            for (var b = 0; b < this.map.tilesets.length; b++) {
				var ts = this.map.tilesets[b];                				
                var tex = new PIXI.Texture.fromImage(this._assetPath(ts.image));
                var tId = ts.firstgid;
                var numX = ts.imagewidth / ts.tilewidth;
                var numY = ts.imageheight / ts.tileheight;                
                this.tilesets.push(ts);
                for(var y=0; y<numY; y++)
                    for(var x=0; x<numX; x++) {
                        var tileInfo = {
                            tex: tex,
                            tId: tId,
                            x: x*ts.tilewidth,
                            y: y*ts.tileheight
                        };
                        tiles.push(tileInfo);
                        tId++;
                    }
			}            
            this.tiles = tiles;
            this._initLayer();
        },
        _initLayer: function() {
            var mapData = this.map;
			var layerIndex = 0;
            var globalLayerIndex = -1;
            this.objectsRaw = [];
            var parentLayer = this.root;
			for (var a = 0; a < mapData.layers.length; a++) {				
				var layerData = mapData.layers[a];				
				if (layerData.visible === false)
					continue;
                globalLayerIndex++;
                var newLayer = null;
				if (layerData.data) { // tilelayer                    
                    newLayer = new PixiTileLayer(layerData.name,
                                     layerData.data,
                                     layerData.width,
                                     layerData.height,
                                     mapData.tilewidth,
                                     mapData.tileheight);
                    parentLayer.addChild(newLayer);
				}
                if (layerData.image) { // imageLayer
                    var imagePath = this._assetPath(layerData.image);                    
                    newLayer = new PixiFillImageLayer(layerData.name, PIXI.Texture.fromImage(imagePath));
                    parentLayer.addChild(newLayer);
                    if (layerData.properties) {
                        if (layerData.properties.repeat)
                           newLayer.repeat = layerData.properties.repeat;
                        if (layerData.properties.stretch)
                            newLayer.setStretch(layerData.properties.stretch);
                        if (layerData.properties.offsetX)
                            newLayer.offsetX = Number(layerData.properties.offsetX);
                        if (layerData.properties.offsetY)
                            newLayer.offsetY = Number(layerData.properties.offsetY);
                        if (layerData.properties.addScaleX)
                            newLayer.offsetScaleX = Number(layerData.properties.addScaleX);
                        if (layerData.properties.addScaleY)
                            newLayer.offsetScaleY = Number(layerData.properties.addScaleY);
                    }
                }
				else { // object layer
					var layerName = layerData.name;					                                        
					if (layerName.indexOf(":") > -1)
					{
						var parts = layerName.split(":");
						if (parts.length === 2) {
							if (parts[1] === "sprites" || parts[1] === "spr") {                                
                                if (parts[0] && parts[0] !== "") {                                    
                                    newLayer = new PixiLayer(parts[0] || "");
                                    parentLayer.addChild(newLayer);                                    
                                }
                                else {
                                    console.warn("SpriteLayer must have a name.", parts, layerData);
                                }
							}
                            else if (parts[1] === "obj") {
                                this.objectsRaw.push({
                                    name: parts[0] || "",
                                    layer: layerData,
                                    layerIndex: globalLayerIndex
                                });
							}
						}
					}
				}
                if (newLayer) {
                    if (layerData.properties &&
                        layerData.properties.parallax) {
                        switch(layerData.properties.parallax) {
                            case "fixed":
                                newLayer.parallax.x = 0;
                                newLayer.parallax.y = 0;
                                break;
                            case "back0":
                                newLayer.parallax.x = 0.1;
                                newLayer.parallax.y = 0;
                                break;
                            case "back1":
                                newLayer.parallax.x = 0.3;
                                newLayer.parallax.y = 0.3;
                                break;
                        }
                    }
                }
			}
            if (this._callback.onLoaded)
                this._callback.onLoaded("Assets loaded");
        },
        /** @private */
        _assetPath: function(tsImage) {
            var cutPos = tsImage.lastIndexOf("../");
            if (cutPos > -1) {
                tsImage = "assets/" + tsImage.substring(cutPos+3);
            }	
            return tsImage;        
        }, 
        update: function() {
            this.root.update(this);
        },
        getLayer: function(name) {
            return this.root.findByName(name);
        }
    };
        
	return PixiWorld;
});