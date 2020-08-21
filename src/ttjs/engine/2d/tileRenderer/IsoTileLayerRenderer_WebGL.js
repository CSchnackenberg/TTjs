/**
 * TouchThing Js (TTjs) - JavaScript Entity/Component Game Framework
 *
 * Copyright (c) 2013, Johannes Brosi <mail@jbrosi.de>
 *
 * Released under the MIT license
 * https://github.com/CSchnackenberg/TTjs/blob/master/LICENSE
 */
define(["require", "exports", "../../../util/WebGL", "@ttjs/lib/gl-matrix", "@ttjs/engine/2d/tileRenderer/Shader", "@ttjs/engine/2d/tileRenderer/Shader"], function (require, exports, WebGL_1, GLMatrix, Shader_1, Shader_2) {
    "use strict";
    exports.__esModule = true;
    exports.TileLayerRenderer_WebGL = void 0;
    "use strict";
    function TileLayerRenderer_WebGL() {
        this._shaderProgram = null;
        this._layerBuffers = [];
        this._layerTileSets = [];
        this._layerTileTileCount = [];
        this._viewMatrix = GLMatrix.mat4.create();
        this._isInitialized = false;
        this._projectionMatrix = null;
    }
    exports.TileLayerRenderer_WebGL = TileLayerRenderer_WebGL;
    TileLayerRenderer_WebGL.prototype = {
        initialize: function (gl) {
            var vertexShader, fragmentShader, program;
            if (this._isInitialized) {
                return;
            }
            this._isInitialized = true;
            this._projectionMatrix = GLMatrix.mat4.create();
            GLMatrix.mat4.ortho(this._projectionMatrix, 0, gl.canvas.width, gl.canvas.height, 0, 0.0001, 10000);
            //create shaders
            vertexShader = WebGL_1.WebGLUtils.compileShader(gl, Shader_1.vertexShaderSource, gl.VERTEX_SHADER);
            fragmentShader = WebGL_1.WebGLUtils.compileShader(gl, Shader_2.fragmentShaderSource, gl.FRAGMENT_SHADER);
            program = WebGL_1.WebGLUtils.createProgram(gl, vertexShader, fragmentShader);
            program.u_projMatrix = gl.getUniformLocation(program, "u_projMatrix");
            program.u_viewMatrix = gl.getUniformLocation(program, "u_viewMatrix");
            program.u_texture = gl.getUniformLocation(program, "u_texture");
            program.u_texture = gl.getUniformLocation(program, "u_texture");
            program.a_position = gl.getAttribLocation(program, "a_position");
            program.a_textureCoords = gl.getAttribLocation(program, "a_textureCoords");
            this._shaderProgram = program;
        },
        /** draws the layer */
        drawLayerScaled: function (destContext, layerIndex, destx, desty, destw, desth, srcx, srcy, srcw, srch, seamlessX, seamlessY) { },
        initializeLayerBuffer: function (gl, mapInfo, layerIndex) {
            console.log("initializing layer " + layerIndex);
            console.log(mapInfo);
            var layer = mapInfo.getLayer(layerIndex), tileSetSwitch = [], data = [], tileWidth = layer.getTileWidth(), tileHeight = layer.getTileHeight(), currentTileSet = null, tilePos = 0, x, y, tileId, tileSet;
            this._layerBuffers[layerIndex] = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this._layerBuffers[layerIndex]);
            for (y = 0; y < layer.getHeight(); y++) {
                for (x = layer.getWidth(); x >= 0; x--) {
                    tileId = layer.getTileId(layer.getWidth() - x, y);
                    tileSet = mapInfo.resolveTileSet(tileId);
                    if (tileSet === undefined) {
                        //console.error("could not find proper tileset for tileId "+tileId+"!");
                        continue;
                    }
                    if (currentTileSet !== tileSet) {
                        tileSetSwitch.push({
                            tileId: tileId,
                            currentTile: tilePos
                        });
                        currentTileSet = tileSet;
                    }
                    var tileWidth = layer.getTileWidth();
                    var tileHeight = layer.getTileHeight();
                    var startX = (layer.getWidth() * tileWidth) - ((y * tileWidth / 2) + (x * tileWidth / 2));
                    var startY = (y * tileHeight / 2) - (x * tileHeight / 2);
                    var endX = startX + tileSet.getTileWidth();
                    var endY = startY + tileSet.getTileHeight();
                    var iBounds = tileSet.getImageBounds(tileId);
                    var texLeft = iBounds.x / tileSet.getImageWidth();
                    var texRight = (iBounds.x + iBounds.width) / tileSet.getImageWidth();
                    var texTop = iBounds.y / tileSet.getImageHeight();
                    var texBottom = (iBounds.y + iBounds.height) / tileSet.getImageHeight();
                    //first the positions in points
                    data.push(startX, startY, //vertex 1
                    texLeft, texTop, endX, startY, //vertex 2
                    texRight, texTop, startX, endY, //vertex 3
                    texLeft, texBottom, startX, endY, //vertex 4
                    texLeft, texBottom, endX, startY, //vertex 5
                    texRight, texTop, endX, endY, //vertex 6
                    texRight, texBottom);
                    tilePos++;
                }
            }
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
            this._layerTileTileCount[layerIndex] = tilePos;
            this._layerTileSets[layerIndex] = tileSetSwitch;
        },
        /* draws the layer */
        drawLayer: function (gl, mapInfo, layerIndex, position) {
            var currentLayer = mapInfo.getLayer(layerIndex), tileWidth = currentLayer.getTileWidth(), tileHeight = currentLayer.getTileHeight(), lastDrawn, lastTileSet, tileSwitch, a;
            this.initialize(gl);
            if (this._layerBuffers[layerIndex] === undefined) {
                this.initializeLayerBuffer(gl, mapInfo, layerIndex);
            }
            gl.useProgram(this._shaderProgram);
            gl.uniformMatrix4fv(this._shaderProgram.u_projMatrix, false, this._projectionMatrix);
            GLMatrix.mat4.identity(this._viewMatrix);
            GLMatrix.mat4.translate(this._viewMatrix, this._viewMatrix, GLMatrix.vec3.fromValues(-position.src.x, -position.src.y, 0));
            gl.uniformMatrix4fv(this._shaderProgram.u_viewMatrix, false, this._viewMatrix);
            //TODO: set view Matrix here
            // look up where the vertex data needs to go.
            gl.bindBuffer(gl.ARRAY_BUFFER, this._layerBuffers[layerIndex]);
            gl.enableVertexAttribArray(this._shaderProgram.a_position);
            gl.vertexAttribPointer(this._shaderProgram.a_position, 2, gl.FLOAT, false, 4 * 4, 0); /*GLFLOAT has 4 byte */
            gl.enableVertexAttribArray(this._shaderProgram.a_textureCoords);
            gl.vertexAttribPointer(this._shaderProgram.a_textureCoords, 2, gl.FLOAT, false, 4 * 4, 2 * 4); /*GLFLOAT has 4 byte */
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            //            gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            lastDrawn = 0;
            tileSwitch = null;
            lastTileSet = null;
            for (a = 0; a < this._layerTileSets[layerIndex].length; a++) {
                tileSwitch = this._layerTileSets[layerIndex][a];
                if (lastDrawn !== 0) {
                    this.bindTexture(gl, mapInfo.resolveTileSet(tileSwitch.tileId));
                    gl.drawArrays(gl.TRIANGLES, lastDrawn * 6, (tileSwitch.currentTile * 6) - (lastDrawn * 6));
                    lastDrawn = tileSwitch.currentTile;
                }
            }
            tileSwitch.currentTile = this._layerTileTileCount[layerIndex];
            this.bindTexture(gl, mapInfo.resolveTileSet(tileSwitch.tileId));
            gl.drawArrays(gl.TRIANGLES, lastDrawn * 6, (tileSwitch.currentTile * 6) - (lastDrawn * 3));
        },
        bindTexture: function (gl, tileSet) {
            var tId = tileSet.getGLTexture(gl);
            if (tId !== 0) {
                //skip 0 texture
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, tId);
                gl.uniform1i(this._shaderProgram.u_texture, 0);
            }
        }
    };
});
//     return TileLayerRenderer_WebGL;
// });
//# sourceMappingURL=IsoTileLayerRenderer_WebGL.js.map