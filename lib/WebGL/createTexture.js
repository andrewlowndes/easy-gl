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
exports.defaultOptions = {
    minFilter: WebGLRenderingContext.LINEAR,
    magFilter: WebGLRenderingContext.LINEAR,
    wrapS: WebGLRenderingContext.CLAMP_TO_EDGE,
    wrapT: WebGLRenderingContext.CLAMP_TO_EDGE,
    flipY: false,
    level: 0,
    internalFormat: WebGLRenderingContext.RGBA,
    border: 0,
    srcFormat: WebGLRenderingContext.RGBA,
    srcType: WebGLRenderingContext.UNSIGNED_BYTE,
    width: 0,
    height: 0,
    premultiplyAlpha: true
};
function createTexture(gl, opts) {
    opts = __assign({}, exports.defaultOptions, opts);
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, opts.flipY ? 1 : 0);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, opts.premultiplyAlpha ? 1 : 0);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, opts.wrapS);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, opts.wrapT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, opts.minFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, opts.magFilter);
    gl.texImage2D(gl.TEXTURE_2D, opts.level, opts.internalFormat, opts.width, opts.height, opts.border, opts.srcFormat, opts.srcType, null);
    return texture;
}
exports.createTexture = createTexture;
