### TTjs-Component Skeleton ###


To build a TTjs component three steps must be perfomred:
- define requirements
- implement behaviour
- register the component


```JavaScript
'use strict';
require(['ttjs/entity/ComponentManager'], function(ComponentManager)
{    	
    function MyComponent() {};

	// define requirements
    MyComponent.requires = {
        need: {},
        opt:  {},
        cmps: [],    
        res: function(prop) {},
		children: function(prop) {}
    };	

	// implement behaviour
	MyComponent.prototype = {      
        onInit: function(entity) { 
        },
        onActivate: function(entity) { 
        },                
        onUpdate: function(entity, elapsedTime) {  
        },
        onDeactivate: function(entity) {
        }        
    };
        
	// register the component
	ComponentManager.registerComponentClass("MyComponent", MyComponent);
});
```

### Requirements in detail ###
When the level/map of the game is loaded TTjs checks whether the
entity instance fullfils the requirements for all components. Each 
component can define a set of required or optional parameter
and check them before the map is loaded. 

Beside properties a component can also express dependencies to
other components, define which child entities may be spawn
by this component and load resources.  

The overall idea is to improve the error reporting of the engine
and allow the entity property definition to be more strict. Additonally
it allows tools like editors etc. to get an inside
into the entity without the need of running the map.

If no requirements are provided it is up to the behavior part
to ensure that everything is setup properly.

```JavaScript
MyComponent.requires = {
	need: {},
	opt:  {},
	cmps: [],    
	res: function(prop) {},
	children: function(prop) {}
};	
```

#### MyComponent.requires.need ####
With *need* you can define a list of properties that must be
specified in the configuration. The component does not offer
a default value. Properties are provided as JavaScript-Properties.

For simple cases you can use a **short notation** with just a
property-name and a string that refers to the property-type
```JavaScript
need: {
	spriteSheetUrl: "string",
	size: "number",
	something: "any"
}
```

You may also specify more advance options for the property.
The option-list depends on the given PropertyParser and
can be adjusted for your specific needs. 
(TODO see PropertyParser)
```JavaScript
need: {
	direction: {type:"number", min:10, max: 100},
	magicNumber: {type:"number", validate: function(val) {
		if (!((val % 2)  === 0))
			return "magicNumber must be even!";
		return true;
	}},
}
```

#### MyComponent.requires.opt ####
With *opt* you specify properties with an default value.
Default (or *optional*) properties are also processed by PropertyParsers
and therfore the same rule apply as in *need*.

The only difference is that you have to provide the default
value and therefore the **short notation** changes slidely:
```JavaScript
opt: {
	spriteSheetUrl: ["string", "sprites/empty.png" /* DEFAULT */],
	size: ["number", 100 /* DEFAULT */],
	something: ["any", {left:10, right: 100} /* DEFAULT */]
}
```

In the advance case you have to provide an additional **def**
to set the default value.
```JavaScript
opt: {
	direction: {type:"number", min:10, max: 100, def:11 /* DEFAULT */},
	magicNumber: {type:"number", def:42 /* DEFAULT */, validate: function(val) {
		if (!((val % 2)  === 0))
			return "magicNumber must be even!";
		return true;
	}},
}
```

#### MyComponent.requires.cmp ####
With 'cmp' you define a set of components that are required by
this component. 

TODO explain the rest, spelling, etc.
