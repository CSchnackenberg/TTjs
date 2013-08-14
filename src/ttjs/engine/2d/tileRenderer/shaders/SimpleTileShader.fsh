/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2013, Christoph Schnackenberg <bluechs@gmx.de>
 * Copyright (c) 2013, Johannes Brosi <mail@jbrosi.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 */
 precision highp float;

uniform sampler2D u_texture;

varying vec2 v_textureCoords;

void main() {
  gl_FragColor = texture2D(u_texture, v_textureCoords);
}