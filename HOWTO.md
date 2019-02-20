### TTjs HOWTOs



#### Howto: Create a fully working Particle System?

**setup context:**

```js
 
const sprSheetJsonConfig = {/* load or define your sprite sheet */};
const spriteAnimationName = ""; // use one of sprSheetJsonConfig
const factory = new Flint.ParticleFactory();
const parent = new createjs.Container();
const sheet = new createjs.SpriteSheet(sprSheetJsonConfig);
``` 

**create emitter, initializer and actions:**
```js
const ps = new Flint.Emitter(parent, factory); 
ps.counter = new Flint.Counter.Blast(5);
ps 
   .addInitializer(new Flint.Initializer.Position())
   .addInitializer(new Flint.Initializer.BlendMode("add"))
   .addInitializer(new Flint.Initializer.BitmapAnimation(sheet, spriteAnimationName))
   .addInitializer(new Flint.Initializer.LifeTime(0.6, 0.7))
   .addInitializer(new Flint.Initializer.Scale(1, 2))
   .addInitializer(new Flint.Initializer.Velocity(-80, 80, -200, -300))
   .addInitializer(new Flint.Initializer.Rotation(0, 360))
   .addInitializer(new Flint.Initializer.RotationVelocity(-360, 360))
   
   .addAction(new Flint.Actions.Move())
   .addAction(new Flint.Actions.TargetVelocity(0, 200, 3))
   .addAction(new Flint.Actions.Age())
   .addAction(new Flint.Actions.Rotate())
;
ps.start();
ps.counter.start();
```

**update once per frame:** 
```js
ps.updateOnFrame(elapsedTime); // elapseTime in seconds
```


#### Howto: Have pixelated images?

```js
const canvas = $('#gfx').get(0); 
const context = canvas.getContext('2d');
context.webkitImageSmoothingEnabled = false;
context.mozImageSmoothingEnabled = false;
context.imageSmoothingEnabled = false;
```


#### Howto: Have an optional boolean property in a component?

```js
MyComponent.requires = {
    need: {},
    opt:  {
        myProp1: {type: "enum", def: true, allowed: [true, false]},
        myProp2: {type: "enum", def: false, allowed: [true, false]}
    },
    cmps: [],    
    res: function(prop) {},
    children: function(prop) {}
};
```

Both values `myProp1` and `myProp2` are optional. If not set `myProp1` defaults to `true` and `myprop` defaults to `false`.   


#### Howto: Have an optional tri-state property in a component?

```js
MyComponent.requires = {
    need: {},
    opt:  {
        myProp: {type: "enum", def: "yes", allowed: ["yes", "no", "maybe"]},
    },
    cmps: [],    
    res: function(prop) {},
    children: function(prop) {}
};
```

`myProp` can only be `yes`, `no` or `maybe`.


#### Howto: Have an optional property number with a default value?

```js
MyComponent.requires = {
    need: {},
    opt:  {
        myProp: ["number", 0.5],
    },
    cmps: [],    
    res: function(prop) {},
    children: function(prop) {}
};
```

`myProp` must be number and defaults to `0.5`.


#### Howto: Have an optional property that is between a min/max value?

```js
MyComponent.requires = {
    need: {},
    opt:  {
        myProp: {
            type: "number",
            min: -5,
            max: 5,
            def: 0 
        },
    },
    cmps: [],    
    res: function(prop) {},
    children: function(prop) {}
};
```

`myProp` is optional but if set it must be larger than `-5` and smaller than `5`


#### Howto: Have an property string which must be set?

```js
MyComponent.requires = {
    need: {
        myProp: "string"
    },
    opt:  {},
    cmps: [],    
    res: function(prop) {},
    children: function(prop) {}
};
```

#### Howto: Load and spawn an Entity into the world?

To create a new Entity instance use the `EntityManager` and call `injectEntity`:  

```js
entityManager.injectEntity(new EntityInstance(
    "NameOfTheInstance",
    "EntityDefinitionName", //< what to create
    {                       //< where to create
        x: 100,
        y: 100,
        w: 1,
        h: 1
    },
    {                      //< how to create
        gamelayer: "default",
        size: 42
    }), (instance) => {
        // use the instance
    }
);
```

This function returns nothing. Instead it calls your callback function with the created entity. If the resources need to be loaded it'll return once the data is loaded.



