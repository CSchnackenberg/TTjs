define([
   'PIXI'
], function(
    PIXI
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
    var PixiWorld = function(stage, tiledMapJson) {
        this.stage = stage;
        this._callback = {};
        this.viewport = {
            x: 0,
            y: 0,
            w: this.stage.width,
            h: this.stage.height
        };
        this.map = tiledMapJson;
        this.layer = {};
        this.assetLader 
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
                //var newLayer = null;
                if (layerData.image) { // imageLayer
                    //var imagePath = this._assetPath(layerData.image);
                    this.pixiAssets.push(layerData.image);
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
                that._initLayer();
                if (that._callback.onProgress)
                    that._callback.onProgress("Assets loaded");
            });
            this.assetLoader.load();
        },
        _initLayer: function() {
            var mapData = this.map;
			var layerIndex = 0;
            var globalLayerIndex = -1;
            this.objectsRaw = [];
            
			for (var a = 0; a < mapData.layers.length; a++) {				
				var layerData = mapData.layers[a];				
				if (layerData.visible === false)
					continue;
                globalLayerIndex++;
                var newLayer = null;
				if (layerData.data) { // tilelayer
//                    var layer = new LayerModel();
//					layer.initialize(layerData.name,
//                                     layerData.width,
//                                     layerData.height,
//                                     mapData.tilewidth,
//                                     mapData.tileheight,
//                                     layerData.data);
//                    var tl = new FxTileLayer(layer, layerIndex++);
//                    newLayer = tl;
//                    tl.name = layerData.name || "";
//                    this.fxLayer.getRoot().addChild(tl);                    
//                    mapRenderModel.addLayer(layer);
				}
                if (layerData.image) { // imageLayer
//                    var imagePath = this._assetPath(layerData.image);
//                    additionalAssets.push({type:"jsImage", url: imagePath });
//                    var filler = new FxFillImage();
//                    newLayer = filler;
//                    filler.name = layerData.name;
//
//                    if (layerData.properties) {
//                        if (layerData.properties.repeat)
//                           filler.repeat = layerData.properties.repeat;
//                        if (layerData.properties.stretch)
//                            filler.setStretch(layerData.properties.stretch);
//                        if (layerData.properties.offsetX)
//                            filler.offsetX = Number(layerData.properties.offsetX);
//                        if (layerData.properties.offsetY)
//                            filler.offsetY = Number(layerData.properties.offsetY);
//                        if (layerData.properties.addScaleX)
//                            filler.scaleX = Number(layerData.properties.addScaleX);
//                        if (layerData.properties.addScaleY)
//                            filler.scaleY = Number(layerData.properties.addScaleY);
//                    }
//
//                    this.fxLayer.getRoot().addChild(filler);
//                    pendingImageFills.push({
//                        fxFiller: filler,
//                        imageUrl: imagePath
//                    });
                }
				else { // object layer
					var layerName = layerData.name;					                                        
					if (layerName.indexOf(":") > -1)
					{
						var parts = layerName.split(":");
						if (parts.length === 2) {
							if (parts[1] === "sprites" || parts[1] === "spr") {
                                
                                if (parts[0] && parts[0] !== "") {
                                    //var sprites = new FxSpriteLayer(this.gameContext.canvas);
                                    //newLayer = sprites;
                                    //sprites.name = parts[0] || "";
                                    //this.fxLayer.getRoot().addChild(sprites);
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
                            else if (parts[1] === "fade_random") {                                
//                                var filler = new FxFillGradient(this.gameContext.canvas);
//                                newLayer = filler;
//                                filler.name = parts[0] || "";
//                                this.fxLayer.getRoot().addChild(filler);
                            }                            
						}
					}
				}
                if (newLayer) {
                    if (layerData.properties &&
                        layerData.properties.parallax) {
                        switch(layerData.properties.parallax) {
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
//            
//			// buildup tilesets            
//            for (var b = 0; b < mapData.tilesets.length; b++) {
//				
//			}
//            for (var i=0; i<additionalAssets.length; i++)
//                requiredAssets.push(additionalAssets[i]);
//            var that = this;
//            this.res.request(requiredAssets, function() {
//                that.gameContext.setState("initTilesets");                
//    			for (var b = 0; b < mapData.tilesets.length; b++) {
//    				var tileSet = new TileSetModel();			
//    				var tileSetData = mapData.tilesets[b];
//    				var tsImage = requiredAssets[b];
//                    var img = that.res.getResource(tsImage.type, tsImage.url);
//    				if (img) {                    
//                        tileSet.initializeWithImage(tileSetData.firstgid,
//                            tileSetData.tilewidth,
//                            tileSetData.tileheight, 
//                            img,
//                            tileSetData.imagewidth, 
//                            tileSetData.imageheight);
//                        mapRenderModel.addTileSet(tileSet);
//                    }
//                    else {
//                        that.gameContext.setError("Cannot load tileset " + tsImage);
//                        return;
//                    }
//    			}
//                // load images
//                for (b=0; b<pendingImageFills.length; b++) {
//                    var data = pendingImageFills[b];
//                    var img = that.res.getResource("jsImage", data.imageUrl);
//                    data.fxFiller.setImage(img);
//                }                
//                that._initGameObjects();
//            });
        },
        _assetPath: function(tsImage) {
            var cutPos = tsImage.lastIndexOf("../");
            if (cutPos > -1) {
                tsImage = "assets/" + tsImage.substring(cutPos+3);
            }	
            return tsImage;        
        }, 
        getLayer: function(name) {
            return this.layer[name];
        }
        
    };

    
        
	return PixiWorld;
});