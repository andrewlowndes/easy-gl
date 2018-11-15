"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var createTexture_1 = require("../WebGL/createTexture");
var generateMipmap_1 = require("../WebGL/generateMipmap");
var defaultCanvasToTextureOptions = {
    level: 0,
    internalFormat: WebGLRenderingContext.RGBA,
    border: 0,
    srcFormat: WebGLRenderingContext.RGBA,
    srcType: WebGLRenderingContext.UNSIGNED_BYTE,
    mipmap: false
};
function canvasToTexture(gl, canvas, opts) {
    opts = __assign({}, defaultCanvasToTextureOptions, opts);
    var texture = createTexture_1.createTexture(gl, Object.assign({ width: 1, height: 1 }, opts));
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, opts.level, opts.internalFormat, opts.srcFormat, opts.srcType, canvas);
    if (opts.mipmap) {
        generateMipmap_1.generateMipmap(gl, texture, Object.assign({ width: canvas.width, height: canvas.height }, opts));
    }
    return texture;
}
exports.canvasToTexture = canvasToTexture;
