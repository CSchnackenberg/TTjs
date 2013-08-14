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

uniform mat4 u_projMatrix, u_viewMatrix;
attribute vec2 a_position;
attribute vec2 a_textureCoords;
varying vec2 v_textureCoords;

void main() {
  gl_Position = u_projMatrix * u_viewMatrix * vec4(a_position, 0, 1);
  v_textureCoords = a_textureCoords;
  gl_PointSize = 5.0;
}