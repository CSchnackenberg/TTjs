/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2013, Christoph Schnackenberg <bluechs@gmx.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 */
// define(['ttjs/lib/lodash'], function(_) {
define(["require", "exports", "@ttjs/lib/lodash"], function (require, exports, _) {
    "use strict";
    exports.__esModule = true;
    exports.QuadTree = void 0;
    "use strict";
    /**
     * Creates a new QuadTree
     *
     * @constructor
     */
    function QuadTree(minQuadSize, left, top, width, height) {
        var x = left || 0;
        var y = top || 0;
        var w = width || 1024;
        var h = height || width;
        this.forceQuad = true;
        this.minQuadSize = minQuadSize || 100;
        this._inRebuild = false;
        this._root = new QuadTreeNode(this, x, y, w, h);
    }
    exports.QuadTree = QuadTree;
    /**
     * @constructor
     * @class circle
     */
    function Circle(x, y, radius) {
        this.x = x || 0;
        this.y = y || 0;
        this.radius = radius || 0;
    }
    ;
    Circle.prototype = {
        left: function () {
            return this.x - this.radius;
        },
        top: function () {
            return this.y - this.radius;
        },
        right: function () {
            return this.x + this.radius;
        },
        bottom: function () {
            return this.y + this.radius;
        }
    };
    /**
     * @constructor
     * @class rectangle
     */
    function Rect(x, y, w, h) {
        this.x = x || 0;
        this.y = y || 0;
        this.w = w || 0;
        this.h = h || 0;
    }
    ;
    Rect.prototype = {
        set: function (x, y, size) {
            this.x = x;
            this.y = y;
            this.w = size;
            this.h = size;
        },
        getQuadrant: function (index) {
            switch (index) {
                case 0: return new Rect(this.x, this.y, this.w * 0.5, this.h * 0.5);
                case 1: return new Rect(this.x + this.w * 0.5, this.y, this.w * 0.5, this.h * 0.5);
                case 2: return new Rect(this.x, this.y + this.h * 0.5, this.w * 0.5, this.h * 0.5);
                case 3: return new Rect(this.x + this.w * 0.5, this.y + this.h * 0.5, this.w * 0.5, this.h * 0.5);
            }
        },
        top: function () {
            return this.y;
        },
        left: function () {
            return this.x;
        },
        right: function () {
            return this.x + this.w;
        },
        bottom: function () {
            return this.y + this.h;
        },
        /**
         * true if the other object is completely inside
         * the rectangle
         *
         * @param {Mixed} other Rect or Circle
         * @returns {Boolean}
         */
        contains: function (other) {
            return (other.left() >= this.x &&
                other.top() >= this.y &&
                other.right() <= this.right() &&
                other.bottom() <= this.bottom());
        },
        intersects: function (other) {
            // TODO replace with true circular approach
            return !(other.left() > this.right() ||
                other.right() < this.x ||
                other.top() > this.bottom() ||
                other.bottom() < this.y);
        }
    };
    function QuadTreeNode(tree, x, y, width, height) {
        this.tree = tree;
        /** sub quadrants of this node */
        this.quadrants = null;
        /** node elements */
        this.elements = [];
        if (x instanceof Rect)
            this.quad = x;
        else
            this.quad = new Rect(x, y, width, height);
    }
    ;
    QuadTreeNode.prototype = {
        addElement: function (e, bounds) {
            if (!this.quad.contains(bounds))
                return false; // is not covered by this quadrant
            // if subquadrant come underneath the size threshold
            // we perform no further subdivisions
            if (this.getSubQudrantSize() < this.tree.minQuadSize) {
                this.elements.push(e);
                return this;
            }
            // create subquadrants if needed
            if (!this.quadrants)
                this.quadrants = [
                    new QuadTreeNode(this.tree, this.quad.getQuadrant(0)),
                    new QuadTreeNode(this.tree, this.quad.getQuadrant(1)),
                    new QuadTreeNode(this.tree, this.quad.getQuadrant(2)),
                    new QuadTreeNode(this.tree, this.quad.getQuadrant(3)),
                ];
            // if the element fits into one subquadrant
            // we let the subquadrant decide where to put it
            if (this.quadrants[0].quad.contains(bounds)) {
                return this.quadrants[0].addElement(e, bounds);
            }
            else if (this.quadrants[1].quad.contains(bounds)) {
                return this.quadrants[1].addElement(e, bounds);
            }
            else if (this.quadrants[2].quad.contains(bounds)) {
                return this.quadrants[2].addElement(e, bounds);
            }
            else if (this.quadrants[3].quad.contains(bounds)) {
                return this.quadrants[3].addElement(e, bounds);
            }
            else {
                // if the bound object is not covered by
                // one subquadrant it means that the object
                // is crossing one or more border.
                // In that case we are responsible for it.
                this.elements.push(e);
                return this;
            }
        },
        getQudrantSize: function () {
            return this.quad.w;
        },
        getSubQudrantSize: function () {
            return Math.min(this.quad.w * 0.5, this.quad.h * 0.5);
        },
        getIntersectingElements: function (queryShape, outList, d) {
            if (this.quad.intersects(queryShape)) {
                //outList.concat(this.elements);
                outList.push.apply(outList, this.elements);
                if (this.quadrants) {
                    this.quadrants[0].getIntersectingElements(queryShape, outList, d + 1);
                    this.quadrants[1].getIntersectingElements(queryShape, outList, d + 1);
                    this.quadrants[2].getIntersectingElements(queryShape, outList, d + 1);
                    this.quadrants[3].getIntersectingElements(queryShape, outList, d + 1);
                }
            }
        }
    };
    /**
     * Read for yourself and cry
     * http://stackoverflow.com/questions/368280/javascript-hashmap-equivalent
     **/
    //	QuadTree.hash = function(value) {
    //		return (typeof value) + ' ' + (value instanceof Object ?
    //		    (value.__qt_hash || (value.__qt_hash = ++QuadTree._hash_current)) :
    //			value.toString());
    //	};
    //	QuadTree._hash_current = 0;
    QuadTree.prototype = {
        addElement: function (e) {
            // implicit interface
            if (!_.isFunction(e.getBounds)) {
                console.error("Passed element is not compatible. ", e, "<- must provide getBounds");
                return false;
            }
            var bounds = e.getBounds();
            if (!(bounds instanceof Rect ||
                bounds instanceof Circle)) {
                console.error("Passed element is not compatible. ", e, "<- getBounds() must return a QuadTree.Circle/QuadTree.Rect. It returned", bounds);
                return false;
            }
            if (e.__quadNode && e.__quadTree === this) {
                console.warn("Element", e, "is already in tree in node", e.__quadNode);
                return false;
            }
            var node = this._root.addElement(e, bounds);
            if (node === false) {
                console.warn("Node was out of QuadTree area. If this happen to often it result in poor performance.");
                this.rebuild([e]);
                return;
            }
            // At this point we have to
            // combine the information: "In which node is the element stored"
            //
            // In adult languages we would simply use a hashmap.
            // We can fake a hash-map with some weired string hacks
            // but I refuse to do so.
            //
            // We simply store the node in the element. This is a small
            // price for the gained performance and way faster
            // than creating hash in JavaScript.
            e.__quadNode = node;
            e.__quadTree = this;
        },
        /**
         * Updates the position of the element within the tree.
         * This function should be reasonably fast as it only
         * has a very small loop to find the element within
         * the node.
         */
        updateElement: function (e) {
            var node = e.__quadNode;
            if (!node || e.__quadTree !== this) {
                console.error("Cannot update element", e, ". Element is not in the tree.");
                return;
            }
            // to update an element we simply remove it
            // from the tree and reinsert it.
            // no node-objects are deleted
            var i, len = node.elements.length;
            for (i = 0; i < len; i++)
                if (node.elements[i] === e)
                    node.elements.splice(i, 1);
            var bounds = e.getBounds();
            node = this._root.addElement(e, bounds);
            if (node === false) {
                console.warn("Node was out of QuadTree area. If this happen to often it result in poor performance.");
                this.rebuild([e]);
            }
            else {
                e.__quadNode = node;
                e.__quadTree = this;
            }
        },
        /**
         * Rebuilds the entire tree with all existing elements
         * and also allows adding new ones.
         *
         * It also ensures that the root node is large enough to
         * cover all elements.
         *
         * This should be used to initialize the tree with all
         * static objects.
         *
         * The function is very costy and should not be uses in
         * mainloop.
         */
        rebuild: function (newElements, saveBorder) {
            if (this._inRebuild) {
                console.error("Found recursion in rebuild. There must be an error.");
                return;
            }
            this._inRebuild = true;
            saveBorder = saveBorder || 100;
            var toInsert = [];
            if (_.isArray(newElements))
                toInsert.push.apply(toInsert, newElements);
            this.collectAllElements(toInsert);
            var len = toInsert.length;
            if (len > 0) {
                // toInsert contains existing and new elements
                // combined in one list. We need that to
                // calculate the size of the new root.
                var bounds = toInsert[0].getBounds();
                var l = bounds.left(), t = bounds.top(), r = bounds.right(), b = bounds.bottom();
                var i = 1;
                for (; i < len; i++) {
                    bounds = toInsert[i].getBounds();
                    if (l > bounds.left())
                        l = bounds.left();
                    if (r < bounds.right())
                        r = bounds.right();
                    if (t > bounds.top())
                        t = bounds.top();
                    if (b < bounds.bottom())
                        b = bounds.bottom();
                }
                var cx = l + (r - l) * 0.5;
                var cy = t + (b - t) * 0.5;
                if (this.forceQuad) {
                    var newSize = (r - cx) + saveBorder;
                    if (b - cy > newSize)
                        newSize = (b - cy) + saveBorder;
                    this._root = new QuadTreeNode(this, cx - newSize, cy - newSize, newSize * 2, newSize * 2);
                }
                else {
                    var newW = (r - cx) + saveBorder;
                    var newH = (b - cy) + saveBorder;
                    this._root = new QuadTreeNode(this, cx - newW, cy - newH, newW * 2, newH * 2);
                }
                var allOk = true;
                // now the tree should handle all elements
                for (i = 0; i < len; i++) {
                    var elem = toInsert[i];
                    elem.__quadNode = null;
                    elem.__quadTree = null;
                    if (this.addElement(elem) === false)
                        allOk = false;
                }
                if (allOk === false) {
                    // found no matching node
                    console.error("Error during rebuild of the tree. Unable to insert one or more elments.");
                }
            }
            this._inRebuild = false;
        },
        contains: function (e) {
            return e.__quadNode && e.__quadTree === this;
        },
        queryElements: function (queryShape) {
            if (!(queryShape instanceof Rect ||
                queryShape instanceof Circle)) {
                console.error("Cannot query with ", queryShape, ". Incompatible type.");
                return [];
            }
            var elements = [];
            this._root.getIntersectingElements(queryShape, elements, 0);
            return elements;
        },
        collectAllElements: function (outList, internNode) {
            internNode = internNode || this._root;
            outList.push.apply(outList, internNode.elements);
            if (internNode.quadrants) {
                this.collectAllElements(outList, internNode.quadrants[0]);
                this.collectAllElements(outList, internNode.quadrants[1]);
                this.collectAllElements(outList, internNode.quadrants[2]);
                this.collectAllElements(outList, internNode.quadrants[3]);
            }
        }
    };
    // -------------------------------------------------------
    // DEBUGGING
    // -------------------------------------------------------
    QuadTree.CanvasDebugDrawer = {
        count: function (qt) {
            this._countNode(qt._root, 0);
        },
        _countNode: function (quadNode, depth) {
            if (!quadNode)
                return;
            if (quadNode.elements.length > 10) {
                console.log(quadNode.quad.w, quadNode.quad.h, depth, " elements: ", quadNode.elements.length, quadNode);
            }
            if (quadNode.quadrants) {
                this._countNode(quadNode.quadrants[0], depth + 1);
                this._countNode(quadNode.quadrants[1], depth + 1);
                this._countNode(quadNode.quadrants[2], depth + 1);
                this._countNode(quadNode.quadrants[3], depth + 1);
            }
        },
        draw: function (qt, ctx, elements) {
            this._drawNode(qt._root, ctx, elements);
        },
        _drawNode: function (quadNode, ctx, elements) {
            if (_.intersection(quadNode.elements, elements).length > 0) {
                ctx.strokeStyle = "#00f";
                ctx.lineWidth = 6;
            }
            else {
                ctx.strokeStyle = "rgba(255,255,0,0.01)";
                ctx.lineWidth = 1;
            }
            ctx.strokeRect(quadNode.quad.x + 1, quadNode.quad.y + 1, quadNode.quad.w - 2, quadNode.quad.h - 2);
            if (quadNode.quadrants) {
                this._drawNode(quadNode.quadrants[0], ctx, elements);
                this._drawNode(quadNode.quadrants[1], ctx, elements);
                this._drawNode(quadNode.quadrants[2], ctx, elements);
                this._drawNode(quadNode.quadrants[3], ctx, elements);
            }
        }
    };
});
// 	return QuadTree;
// });
//# sourceMappingURL=QuadTree.js.map