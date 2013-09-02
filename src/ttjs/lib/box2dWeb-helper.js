

define(["Box2D"], function (Box2D) {
    
    return {
        createRandomPolygonShape: function(radius) {
            var numVerts = 3.5 + Math.random() * 5;
            numVerts = numVerts | 0;
            var verts = [];
            for (var i = 0; i < numVerts; i++) {
                var angle = i / numVerts * 360.0 * 0.0174532925199432957;
                verts.push( new Box2D.Common.Math.b2Vec2( radius * Math.sin(angle), radius * -Math.cos(angle) ) );
            }            
            return this.createPolygonShape(verts);
        },
        createPolygonShape: function(vertices) {
            var shape = new Box2D.Collision.Shapes.b2PolygonShape.AsArray(vertices, vertices.length);            
//            var buffer = Box2D.allocate(vertices.length * 8, 'float', Box2D.ALLOC_STACK);
//            var offset = 0;
//            for (var i=0;i<vertices.length;i++) {
//                Box2D.setValue(buffer+(offset), vertices[i].get_x(), 'float'); // x
//                Box2D.setValue(buffer+(offset+4), vertices[i].get_y(), 'float'); // y
//                offset += 8;
//            }
//            var ptr_wrapped = Box2D.wrapPointer(buffer, Box2D.b2Vec2);
//            shape.Set(ptr_wrapped, vertices.length);
            
            
            return shape;
        },
        
        createPolygonShapeFromPoints: function(points) {
            var vertices = [];
            for (var i=0; i < points.length; i++) {
                vertices.push(new Box2D.Common.Math.b2Vec2(points[i].x, points[i].y));
            }
            return this.createPolygonShape(vertices);
        }
    };
    
});