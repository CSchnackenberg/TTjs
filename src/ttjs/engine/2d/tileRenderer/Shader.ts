export const vertexShaderSource = `precision highp float;

uniform mat4 u_projMatrix, u_viewMatrix;
attribute vec2 a_position;
attribute vec2 a_textureCoords;
varying vec2 v_textureCoords;

void main() {
  gl_Position = u_projMatrix * u_viewMatrix * vec4(a_position, 0, 1);
  v_textureCoords = a_textureCoords;
  gl_PointSize = 5.0;
}
`;

export const fragmentShaderSource = `precision highp float;

uniform sampler2D u_texture;

varying vec2 v_textureCoords;

void main() {
  gl_FragColor = texture2D(u_texture, v_textureCoords);
}
`;