define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.fragmentShaderSource = exports.vertexShaderSource = void 0;
    exports.vertexShaderSource = "precision highp float;\n\nuniform mat4 u_projMatrix, u_viewMatrix;\nattribute vec2 a_position;\nattribute vec2 a_textureCoords;\nvarying vec2 v_textureCoords;\n\nvoid main() {\n  gl_Position = u_projMatrix * u_viewMatrix * vec4(a_position, 0, 1);\n  v_textureCoords = a_textureCoords;\n  gl_PointSize = 5.0;\n}\n";
    exports.fragmentShaderSource = "precision highp float;\n\nuniform sampler2D u_texture;\n\nvarying vec2 v_textureCoords;\n\nvoid main() {\n  gl_FragColor = texture2D(u_texture, v_textureCoords);\n}\n";
});
//# sourceMappingURL=Shader.js.map