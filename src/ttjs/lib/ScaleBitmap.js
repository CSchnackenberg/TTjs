/**
 * ScaleBitmap
 * Visit http://createjs.com/ for documentation, updates and examples.
 *
 * Copyright (c) 2010 gskinner.com, inc.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * ==================================================
 *
 * Modifications:
 *
 * Copyright (c) 2019, Christoph Schnackenberg <bluechs@gmx.de>
 *
 * - Adjusted it to work as AMD thingy
 * - changed the way it handles cases where the edges are thinner than the defined border
 */
define([
	'ttjs/lib/easeljs-1.0.0.min'
], function(
	createjs
) {
	"use strict";



	/**
	 * A ScaleBitmap represents an Image, Canvas, or Video in the display list and is split into nine separate regions
	 * to allow independent scaling of each region. This display object can be used to create scaling UI skins, such as
	 * buttons and backgrounds with rounded corners. A ScaleBitmap can be instantiated using an existing HTML element,
	 * or a string, similar to a Bitmap.
	 *
	 * <h4>Example</h4>
	 *      var bitmap = new createjs.ScaleBitmap("imagePath.jpg", new createjs.Rectangle(14, 14, 3, 3));
	 *      bitmap.setDrawSize(100, 100);
	 *
	 * Note: When a string path or image tag that is not yet loaded is used, the stage may need to be redrawn before it
	 * will be displayed.
	 *
	 * @class ScaleBitmap
	 * @extends DisplayObject
	 * @constructor
	 * @param {Image | HTMLCanvasElement | HTMLVideoElement | String} imageOrUri The source object or URI to an image to display. This can be either an Image, Canvas, or Video object, or a string URI to an image file to load and use. If it is a URI, a new Image object will be constructed and assigned to the .image property.
	 * @param {Rectangle} scale9Grid The inner rectangle of the nine region grid.
	 **/
	function ScaleBitmap(imageOrUri, scale9Grid) {
		this.DisplayObject_constructor();

		// public properties:
		/**
		 * The image to render. This can be an Image, a Canvas, or a Video.
		 * @property image
		 * @type Image | HTMLCanvasElement | HTMLVideoElement
		 **/
		if (typeof imageOrUri == "string") {
			this.image = new Image();
			this.image.src = imageOrUri;
		} else {
			this.image = imageOrUri;
		}

		/**
		 * Specifies the width of the drawn ScaleBitmap.
		 * @property drawWidth
		 * @type Number
		 * @default The original width of the image.
		 */
		this.drawWidth = this.image.width;

		/**
		 * Specifies the height of the drawn ScaleBitmap.
		 * @property drawHeight
		 * @type Number
		 * @default The original height of the image.
		 */
		this.drawHeight = this.image.height;
		/**
		 * Specifies the inner rectangle of the nine region scaling grid.
		 * @property scale9Grid
		 * @type Rectangle
		 */
		this.scale9Grid = scale9Grid;

		/**
		 * Whether or not the ScaleBitmap should be draw to the canvas at whole pixel coordinates.
		 * @property snapToPixel
		 * @type Boolean
		 * @default true
		 **/
		this.snapToPixel = true;
	}

	var p = createjs.extend(ScaleBitmap, createjs.DisplayObject);
	ScaleBitmap.prototype.constructor = ScaleBitmap;

// public methods:

	/**
	 * Changes the dimensions used the draw the ScaleBitmap.
	 *
	 * @method setDrawSize
	 * @param {Number} newWidth The new width of the drawn ScaleBitmap.
	 * @param {Number} newHeight The new height of the drawn ScaleBitmap.
	 */
	p.setDrawSize = function(newWidth, newHeight) {
		this.drawWidth = newWidth;
		this.drawHeight = newHeight;
	};

	/**
	 * Returns true or false indicating whether the display object would be visible if drawn to a canvas.
	 * This does not account for whether it would be visible within the boundaries of the stage.
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method isVisible
	 * @return {Boolean} Boolean indicating whether the display object would be visible if drawn to a canvas
	 **/
	p.isVisible = function() {
		var hasContent = this.cacheCanvas || (this.image && (this.image.complete || this.image.getContext || this.image.readyState >= 2));
		return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
	};

	/**
	 * Draws the display object into the specified context ignoring it's visible, alpha, shadow, and transform.
	 * Returns true if the draw was handled (useful for overriding functionality).
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method draw
	 * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
	 * @param {Boolean} ignoreCache Indicates whether the draw operation should ignore any current cache.
	 * For example, used for drawing the cache (to prevent it from simply drawing an existing cache back
	 * into itself).
	 **/
	p.draw = function(ctx, ignoreCache) {
		if (this.DisplayObject_draw(ctx, ignoreCache)) { return true; }

		var centerWidth = this.scale9Grid.width;
		var centerHeight = this.scale9Grid.height;
		if(centerWidth == 0) //vertical
		{
			if(centerHeight == 0)
			{
				throw "One of scale9Grid width or height must be greater than zero.";
			}
			var imageWidth = this.image.width;
			var scale3Region1 = this.scale9Grid.y;
			var scale3Region3 = this.image.height - scale3Region1 - centerHeight;
			var oppositeEdgeScale = this.drawWidth / imageWidth;
			var scaledFirstRegion = scale3Region1 * oppositeEdgeScale;
			var scaledThirdRegion = scale3Region3 * oppositeEdgeScale;
			var scaledSecondRegion = this.drawHeight - scaledFirstRegion - scaledThirdRegion;

			ctx.drawImage(this.image, 0, 0, imageWidth, scale3Region1, 0, 0, this.drawWidth, scaledFirstRegion);
			ctx.drawImage(this.image, 0, scale3Region1, imageWidth, centerHeight, 0, scaledFirstRegion, this.drawWidth, scaledSecondRegion);
			ctx.drawImage(this.image, 0, scale3Region1 + centerHeight, imageWidth, scale3Region3, 0, scaledFirstRegion + scaledSecondRegion, this.drawWidth, scaledThirdRegion);
		}
		else if(centerHeight == 0) //horizontal
		{
			var imageHeight = this.image.height;
			scale3Region1 = this.scale9Grid.x;
			scale3Region3 = this.image.width - scale3Region1 - centerWidth;
			oppositeEdgeScale = this.drawHeight / this.image.height;
			scaledFirstRegion = scale3Region1 * oppositeEdgeScale;
			scaledThirdRegion = scale3Region3 * oppositeEdgeScale;
			scaledSecondRegion = this.drawWidth - scaledFirstRegion - scaledThirdRegion;

			ctx.drawImage(this.image, 0, 0, scale3Region1, imageHeight, 0, 0, scaledFirstRegion, this.drawHeight);
			ctx.drawImage(this.image, scale3Region1, 0, centerWidth, imageHeight, scaledFirstRegion, 0, scaledSecondRegion, this.drawHeight);
			ctx.drawImage(this.image, scale3Region1 + centerWidth, 0, scale3Region3, imageHeight, scaledFirstRegion + scaledSecondRegion, 0, scaledThirdRegion, this.drawHeight);
		}
		else
		{
			var left = this.scale9Grid.x;
			var top = this.scale9Grid.y;
			var right = this.image.width - centerWidth - left;
			var bottom = this.image.height - centerHeight - top;
			var scaledCenterWidth = this.drawWidth - left - right;
			var scaledCenterHeight = this.drawHeight - top - bottom;

			if (scaledCenterWidth > 0 && scaledCenterHeight > 0) {

				// top left
				ctx.drawImage(this.image, 0, 0, left, top, 0, 0, left, top);
				// top middle
				ctx.drawImage(this.image, left, 0, centerWidth, top, left, 0, scaledCenterWidth, top);
				// top right
				ctx.drawImage(this.image, left + centerWidth, 0, right, top, left + scaledCenterWidth, 0, right,  top);

				// middle left
				ctx.drawImage(this.image, 0, top, left, centerHeight, 0, top, left, scaledCenterHeight);
				// middle middle
				ctx.drawImage(this.image, left, top, centerWidth, centerHeight, left, top, scaledCenterWidth, scaledCenterHeight);
				// middle right
				ctx.drawImage(this.image, left + centerWidth, top, right, centerHeight, left + scaledCenterWidth, top, right, scaledCenterHeight);


				// bottom left
				ctx.drawImage(this.image, 0, top + centerHeight, left, bottom, 0, top + scaledCenterHeight, left, bottom);
				// bottom
				ctx.drawImage(this.image, left, top + centerHeight, centerWidth, bottom, left, top + scaledCenterHeight, scaledCenterWidth, bottom);
				// bottom right
				ctx.drawImage(this.image, left + centerWidth, top + centerHeight, right, bottom, left + scaledCenterWidth, top + scaledCenterHeight, right, bottom);
			}
			else if (scaledCenterHeight > 0) {

				scaledCenterWidth = 0;
				const xScale = (this.drawWidth) / (left + right);

				// top left
				ctx.drawImage(this.image,
					0, 0, left, top,
					0, 0, left*xScale, top);
				// top right
				ctx.drawImage(this.image,
					left + centerWidth, 0, right, top,
					(left + scaledCenterWidth)*xScale, 0, right * xScale,  top);

				// middle left
				ctx.drawImage(this.image,
					0, top, left, centerHeight,
					0, top, left*xScale, scaledCenterHeight);
				// middle right
				ctx.drawImage(this.image,
					left + centerWidth, top, right, centerHeight,
					(left + scaledCenterWidth) * xScale, top, right*xScale, scaledCenterHeight);

				// bottom left
				ctx.drawImage(this.image,
					0, top + centerHeight, left, bottom,
					0, top + scaledCenterHeight, left*xScale, bottom);
				// bottom right
				ctx.drawImage(this.image,
					left + centerWidth, top + centerHeight, right, bottom,
					(left + scaledCenterWidth)*xScale, top + scaledCenterHeight, right*xScale, bottom);

			}
			else if (scaledCenterWidth > 0) {

				scaledCenterHeight = 0;
				const yScale = (this.drawHeight) / (top+bottom);

				// top left
				ctx.drawImage(this.image,
					0, 0, left, top,
					0, 0, left, top*yScale);
				// top middle
				ctx.drawImage(this.image,
					left, 0, centerWidth, top,
					left, 0, scaledCenterWidth, top*yScale);
				// top right
				ctx.drawImage(this.image,
					left + centerWidth, 0, right, top,
					left + scaledCenterWidth, 0, right, top*yScale);

				// bottom left
				ctx.drawImage(this.image,
					0, top + centerHeight, left, bottom,
					0, (top + scaledCenterHeight) * yScale, left, bottom*yScale);
				// bottom
				ctx.drawImage(this.image,
					left, top + centerHeight, centerWidth, bottom,
					left, (top + scaledCenterHeight) * yScale, scaledCenterWidth, bottom*yScale);
				// bottom right
				ctx.drawImage(this.image,
					left + centerWidth, top + centerHeight, right, bottom,
					left + scaledCenterWidth, (top + scaledCenterHeight) * yScale, right, bottom*yScale);

			}
			else {

				const xScale = (this.drawWidth) / (left + right);
				const yScale = (this.drawHeight) / (top + bottom);

				// top left
				ctx.drawImage(this.image,
					0, 0, left, top,
					0, 0, left*xScale, top*yScale);

				// top right
				ctx.drawImage(this.image,
					left + centerWidth, 0, right, top,
					left * xScale, 0, right*xScale,  top*yScale);

				// bottom left
				ctx.drawImage(this.image,
					0, top + centerHeight, left, bottom,
					0, top*yScale, left*xScale, bottom*yScale);

				// bottom right
				ctx.drawImage(this.image,
					left + centerWidth, top + centerHeight, right, bottom,
					left*xScale, top*yScale, right*xScale, bottom*yScale);

			}


		}

		return true;
	};

	/**
	 * Returns a clone of the ScaleBitmap instance.
	 * @method clone
	 * @return {ScaleBitmap} a clone of the ScaleBitmap instance.
	 **/
	p.clone = function() {
		var o = new ScaleBitmap(this.image, this.scale9Grid.clone());
		if (this.sourceRect) { o.sourceRect = this.sourceRect.clone(); }
		this.cloneProps(o);
		return o;
	};

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	p.toString = function() {
		return "[ScaleBitmap (name="+  this.name +")]";
	};

	ScaleBitmap = createjs.promote(ScaleBitmap, "DisplayObject");


	return ScaleBitmap;

});