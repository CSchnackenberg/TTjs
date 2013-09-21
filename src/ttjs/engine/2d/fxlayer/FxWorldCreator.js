/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2013, Christoph Schnackenberg <bluechs@gmx.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 */
define([
	'ttjs/engine/2d/fxlayer/FxLayer',
    'ttjs/engine/2d/fxlayer/FxWorld',
    'ttjs/engine/2d/fxlayer/FxTileLayer',
    'ttjs/engine/2d/fxlayer/FxSpriteLayer',
    'ttjs/engine/2d/fxlayer/FxFillImage',
    'ttjs/engine/2d/fxlayer/FxFillGradient',
    
    'ttjs/engine/2d/tileRenderer/TileLayerRenderer_Canvas',    
    'ttjs/engine/map/tiled/MapRenderModel',
    'ttjs/engine/map/tiled/LayerModel',
    'ttjs/engine/map/tiled/TileSetModel',
    
    'ttjs/entity/ResourceManager',
    'ttjs/entity/resources/ImageResources',
    'ttjs/entity/resources/TextResources',    
    
    'ttjs/lib/lodash',
], function(
    FxLayer,
    FxWorld,
    FxTileLayer,
    FxSpriteLayer,
    FxFillImage,    
    FxFillGradient,
    TileLayerRenderer_Canvas,
    
    MapRenderModel,
    LayerModel,
    TileSetModel,
        
    ResourceManager,
    ImageResources,
    TextResources,
    
    _
)
{    
	"use strict";
    
    /**
     * @class Object to load a FxWorld
     * @constructor
     */
    function FxWorldCreator(canvas, creatorListener) {
        this.tileRenderer = new TileLayerRenderer_Canvas();
        this.mapRenderModel = new MapRenderModel();               
        this.fxWorld = new FxWorld(this.tileRenderer, this.mapRenderModel);
        this.fxWorld.initCanvas(canvas, canvas.getContext("2d"));
        this.canvas = canvas;
        this.objectsRaw = [];
        
        this.res = new ResourceManager();
        this.res.addManager(new ImageResources());
        this.res.addManager(new TextResources());
        this.listener = creatorListener || {
            onProgress: function() {},
            onError: function() {},
            onSuccess: function() {},
            fixAssetPath: function(s) {return s; }
        };
	};
    
    FxWorldCreator.prototype = {              
        /**
         * @param {JSON} mapData
         * @returns {undefined}
         */
        loadFromTiledMap: function(mapData) {
            var additionalAssets = [];
            var pendingImageFills = [];
			// buildup Layers
			var layerIndex = 0;
            var globalLayerIndex = -1;
			for (var a = 0; a < mapData.layers.length; a++) {				
				var layerData = mapData.layers[a];				
				if (layerData.visible === false)
					continue;
                globalLayerIndex++;
                var newLayer = null;
				if (layerData.data) { // tilelayer
                    var layer = new LayerModel();
					layer.initialize(layerData.name,
                                     layerData.width,
                                     layerData.height,
                                     mapData.tilewidth,
                                     mapData.tileheight,
                                     layerData.data);
                    var tl = new FxTileLayer(layer, layerIndex++);
                    newLayer = tl;
                    tl.name = layerData.name || "";
                    this.fxWorld.getRoot().addChild(tl);                    
                    this.mapRenderModel.addLayer(layer);
				}
                if (layerData.image) { // imageLayer
                    var imagePath = this.listener.fixAssetPath(layerData.image);
                    additionalAssets.push({type:"jsImage", url: imagePath });
                    var filler = new FxFillImage();
                    newLayer = filler;
                    filler.name = layerData.name;
                    if (layerData.properties) {
                        if (layerData.properties.repeat)
                           filler.repeat = layerData.properties.repeat;
                        if (layerData.properties.stretch)
                            filler.setStretch(layerData.properties.stretch);
                        if (layerData.properties.offsetX)
                            filler.offsetX = Number(layerData.properties.offsetX);
                        if (layerData.properties.offsetY)
                            filler.offsetY = Number(layerData.properties.offsetY);
                        if (layerData.properties.addScaleX)
                            filler.scaleX = Number(layerData.properties.addScaleX);
                        if (layerData.properties.addScaleY)
                            filler.scaleY = Number(layerData.properties.addScaleY);
                    }
                    this.fxWorld.getRoot().addChild(filler);
                    pendingImageFills.push({
                        fxFiller: filler,
                        imageUrl: imagePath
                    });
                }
				else { // object layer
					var layerName = layerData.name;					                                        
					if (layerName.indexOf(":") > -1)
					{
						var parts = layerName.split(":");
						if (parts.length === 2) {
							if (parts[1] === "sprites") {
                                
                                if (parts[0] && parts[0] !== "") {
                                    var sprites = new FxSpriteLayer(this.canvas);
                                    newLayer = sprites;
                                    sprites.name = parts[0] || "";
                                    this.fxWorld.getRoot().addChild(sprites);
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
                                var filler = new FxFillGradient(this.canvas);
                                newLayer = filler;
                                filler.name = parts[0] || "";
                                this.fxWorld.getRoot().addChild(filler);
                            }
                            else if (parts[1] === "collision") {
//                                for (var i=0; i<layerData.objects.length; i++) {
//                                    var shape = layerData.objects[i]; 
//                                    if (shape.polygon) {
//                                        var b = this.physics.insertBodyFromConcaveForm(shape.polygon, 2.5, 0.5, shape.x, shape.y); 
//                                        b.userData = this.physics.constants.walkable;
//                                    }
//                                }
                            }
                            else {
                                console.warn("Unknown object-layer-type '" + parts[1]+"'");
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
            this.listener.onProgress("loadTiles");
			// buildup tilesets
            var requiredAssets = [];
            for (var b = 0; b < mapData.tilesets.length; b++) {
				var tileSetData = mapData.tilesets[b];				
				var tsImage = this.listener.fixAssetPath(tileSetData.image);
                requiredAssets.push({type:"jsImage", url:tsImage});
			}
            for (var i=0; i<additionalAssets.length; i++)
                requiredAssets.push(additionalAssets[i]);
            var that = this;
            this.res.request(requiredAssets, function() {
                that.listener.onProgress("initTilesets");                
    			for (var b = 0; b < mapData.tilesets.length; b++) {
    				var tileSet = new TileSetModel();			
    				var tileSetData = mapData.tilesets[b];
    				var tsImage = requiredAssets[b];
                    var img = that.res.getResource(tsImage.type, tsImage.url);
    				if (img) {                    
                        tileSet.initializeWithImage(tileSetData.firstgid,
                            tileSetData.tilewidth,
                            tileSetData.tileheight, 
                            img,
                            tileSetData.imagewidth, 
                            tileSetData.imageheight);
                        that.mapRenderModel.addTileSet(tileSet);
                    }
                    else {
                        that.listener.onError("Cannot load tileset " + tsImage);
                        return;
                    }
    			}
                // load images
                for (b=0; b<pendingImageFills.length; b++) {
                    var data = pendingImageFills[b];
                    var img = that.res.getResource("jsImage", data.imageUrl);
                    data.fxFiller.setImage(img);
                }                
                that._mapFinished();
            });
        },
        _mapFinished: function() {
            this.listener.onSuccess(this);
        }
    };
        
	return FxWorldCreator;
});
