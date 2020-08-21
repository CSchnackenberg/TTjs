# TTjs - FxLayer #
[work in progress]


TODO update to easeljs-1.0.0.js

---

A simple 2D API that utilizes 'ttjs/engine/2d/tileRenderer' and easeljs
for scenes created with tile layer and sprites.

Main scenario is using "Tiled Map-Editor" to create simple
2D games.

It supports multiple layertypes (tiles, eseal-stages with sprites,
html content, complex shapes, filling, gradients, etc.).

A simple camera concept allows scrolling including parallax effects.

===

### Usage ###

It expects you to create a map with tiles, objects or image layers
in Tiled. By using a naming convention you can define different
types of layer.

Just name them: name:layertype e.g.

```
shadows:sprite
```

To load a FxWorld just use the FxWorldCreator:

```js
// loading the world
var worldCreator = new FxWorldCreator(this.gameContext.canvas, {
    onProgress: function(msg) {
        console.log(msg);
    },
    onError: function(err) {
        console.error(err);
    },
    onSuccess: function() {
        console.log("success");
        var world = worldCreator;
    },
    fixAssetPath: function(assetPath) {
        // here you can adjust all assets path for your project setup
        return assetPath;
    }
});            
worldCreator.loadFromTiledMap(mapData);   

// in mainloop

world.fxWorld.viewport.x += 1; //<scrolling
world.fxWorld.draw(); // render it to the canvas

```

Currently there is support the following layer-types:

* Spritelayer and general shapes (a easeljs stage is provided)
* Tilelayer (iso mode not yet supported)
* Gradient fill layer
* Fill image layer (for backgrounds etc.)

