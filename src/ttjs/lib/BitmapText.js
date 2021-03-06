
/*
 *
 * BitmapText is ported from lycheeJS
 *
 * BitmapText & lycheeJS
 * (c) 2010-2012 Christoph Martens (@martensms)
 *
 * lycheeJS is licenced under MIT License
 * http://github.com/martensms/lycheeJS
 *
 *
 * The Sprites and Font settings were generated with
 * the Font Tool that is part of lycheeJS:
 * http://martens.ms/lycheeJS/tool/Font.html
 *
 *
 * An example call for the BitmapText would look like:
 *
 * new BitmapText('Hello World!', {
 *
 *   sprite: {Image}
 *   settings: {
 *     baseline: 6,
 *     charset: " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~",
 *     kerning: 0,
 *     spacing: 20,
 *     map: [19,25,30,46,35,83,61,20,24,30,39,46,23,40,22,25,51,27,49,46,49,48,50,41,49,45,22,24,38,46,38,39,70,53,55,45,64,52,39,48,50,23,39,43,39,59,47,54,39,53,50,54,39,49,37,68,42,43,47,24,26,28,37,44,34,34,35,29,35,33,24,34,34,21,20,34,20,48,34,34,33,34,29,28,24,34,30,43,32,34,33,29,19,29,41]
 *   }
 *
 * });
 *
 *
 * Explanations:
 *
 * @settings.baseline:
 *   The baseline shifts the rendering of the letters, it is generated by the
 *   Font Export Tool and detected automatically.
 *
 * @settings.charset:
 *   The charset is the string that has to stay in sync with the @settings.map,
 *   it contains all characters that are included in the sprite.
 *
 * @settings.spacing:
 *   The spacing is the value with which each letter is distanciated on the sprite.
 *   So, the spacing is the maximum value of your kerning until you will get
 *   rendering issues.
 *
 * @settings.kerning:
 *   Use this value to change the offset of rendered letters to a better readable
 *   one. For example, you will need this for having overlapping letters.
 *
 * @settings.map:
 *   It contains a map of widths of each character - including its outline. It
 *   has to stay in sync with the length of the charset.
 *
 *
 * ==================================================
 *
 * Modifications:
 *
 * Copyright (c) 2019, Christoph Schnackenberg <bluechs@gmx.de>
 *
 * TODO remove. Kind of replaced by BitmapText of easel itself
 */
define([
	'ttjs/lib/easeljs'
], function(
	Fx
) {

	const BitmapText = function(text, font) {
		this.initialize(text, font);
	};

	const p = BitmapText.prototype = new Fx.DisplayObject();

	BitmapText._workingContext = document.createElement("canvas").getContext("2d");

	p.charset = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
	p.text = "";
	p.font = null;
	p.textAlign = null;
	p.textBaseline = null;
	p.maxWidth = null;
	p.outline = false;
	p.lineWidth = null;

	p.DisplayObject_initialize = p.initialize;

	p.initialize = function(text, font) {
		this.DisplayObject_initialize();
		this.text = text;
		this.font = font;
		this.__sprite = null;
		this.__settings = null;
	};

	p.isVisible = function() {
		return Boolean(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && this.text != null && this.text !== "");
	};

	p.DisplayObject_draw = p.draw;


	p.draw = function(ctx, ignoreCache) {
		if (this.DisplayObject_draw(ctx, ignoreCache)) { return true; }

		this._drawText(ctx);

		return true;
	};

	p.getMeasuredWidth = function() {
		return this._getWorkingContext().width;
	};

	p.getMeasuredHeight = function() {
		return this._getWorkingContext().width*1.2;
	};

	p.getMeasuredLineHeight = function() {
		return this._drawText()*(this.lineHeight||this.getMeasuredLineHeight());
	};

	p.clone = function() {
		var o = new BitmapText(this.text, this.font);
		this.cloneProps(o);
		return o;
	};

	p.toString = function() {
		return "[BitmapText (text="+  (this.text.length > 20 ? this.text.substr(0, 17)+"..." : this.text) +")]";
	}

	p.DisplayObject_cloneProps = p.cloneProps;

	p.cloneProps = function(o) {
		this.DisplayObject_cloneProps(o);
		o.textAlign = this.textAlign;
		o.textBaseline = this.textBaseline;
		o.maxWidth = this.maxWidth;
		o.outline = this.outline;
		o.lineHeight = this.lineHeight;
		o.lineWidth = this.lineWidth;
	};

	p._getWorkingContext = function() {
		var ctx = BitmapText._workingContext;
		return ctx;
	};

	p._drawText = function(ctx) {

		var paint = !!ctx;
		if (!paint) { ctx = this._getWorkingContext(); }

		var font = this.font;

		var width = 0,
			height = 0;

		var chr, t, l;
		for (t = 0, l = this.text.length; t < l; t++) {
			chr = this._getChar(this.text[t]);
			width += chr.width + font.settings.kerning;
			height = Math.max(height, chr.height);
		}

		// FIXME: This is a hack for EaselJS' strange
		// ctx. translate concept... hmpf -.-
		var margin = 0 + (-2 * font.settings.kerning);

		for (t = 0, l = this.text.length; t < l; t++) {

			chr = this._getChar(this.text[t]);

			ctx.drawImage(
				font.sprite,
				chr.x,
				chr.y,
				chr.width + font.settings.spacing * 2,
				chr.height,
				margin - font.settings.spacing,
				0 - font.settings.baseline,
				chr.width + font.settings.spacing * 2,
				chr.height
			);

			margin += chr.width + font.settings.kerning;
		}


		this.__lastRenderCall = this.text;
	};

	p._getChar = function(character) {

		var font = this.font;
		if (font.__characters === undefined) {

			font.__characters = {};

			var charset = font.settings.charset || this.charset;

			var offset = font.settings.spacing || 0;
			for (var c = 0, l = charset.length; c < l; c++) {

				var chr = {
					id: charset[c],
					width: font.settings.map[c] || 0,
					height: font.sprite.height || 0,
					x: offset - font.settings.spacing,
					y: 0
				};

				offset += chr.width + font.settings.spacing * 2;

				font.__characters[chr.id] = chr;

				if (!font.__characters.DEFAULT) {
					font.__characters.DEFAULT = chr;
				}

			}

		}

		return font.__characters[character] || font.__characters.DEFAULT;

	};

	//window.BitmapText = BitmapText;

//}(window));

	return BitmapText;

});