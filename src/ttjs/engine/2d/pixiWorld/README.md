# TTjs - PixiWorld #

A simple 2D API that utilizes 'PIXI' for rendering
a parallax 2D scrolling world loaded from a map created with 'Tiled'.

It frees you from the pain of impl. a camera, supports
tiles and so on.

===

### Usage ###

It expects you to create a map with tile, object or image layers
in tiled. During a naming convention you can defined different
types of layer.

Just name them: name:layertype e.g.

```
sprites:layer
```

After loading a "PixiWorld" map you can access the layer via
their names.

Currently we support the following layer-types:

```
* sprite, spr 
  The layer is a simple PIXI.DisplayObjectContainer.
  You can add sprites etc. from your game.

* tiles, <nothing>
  A tile-layer is automatically a PixiTileLayer. It consists
  of multiple TilingSprites. Enough to fill the entire stage.

* img, <nothing>
  An image-layer is automatically a FxFillImage. The loaded
  image is scaled to fill the entire screen.
```


### Background ###

Internally each layer is represented by a PIXI.DisplayObjectContainer
and therefore offer the entire featureset of PIXI.  
