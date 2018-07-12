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
var isPowerOf2_1 = require("../Util/isPowerOf2");
var defaultOptions = {
    minFilter: WebGLRenderingContext.LINEAR_MIPMAP_LINEAR,
    magFilter: WebGLRenderingContext.LINEAR,
    wrapS: WebGLRenderingContext.CLAMP_TO_EDGE,
    wrapT: WebGLRenderingContext.CLAMP_TO_EDGE,
    flipY: false,
    anisotropy: 16,
    width: 0,
    height: 0
};
function generateMipmap(gl, texture, opts) {
    opts = __assign({}, defaultOptions, opts);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    if (isPowerOf2_1.isPowerOf2(opts.width) && isPowerOf2_1.isPowerOf2(opts.height)) {
        gl.generateMipmap(gl.TEXTURE_2D);
        if (opts.anisotropy) {
            var ext = (gl.getExtension('EXT_texture_filter_anisotropic') ||
                gl.getExtension('MOZ_EXT_texture_filter_anisotropic') ||
                gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic'));
            if (ext) {
                var max = Math.min(opts.anisotropy, gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT));
                gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, max);
            }
        }
    }
    else {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        switch (opts.minFilter) {
            case gl.NEAREST_MIPMAP_NEAREST:
            case gl.LINEAR_MIPMAP_NEAREST:
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                break;
            case gl.NEAREST_MIPMAP_LINEAR:
            case gl.LINEAR_MIPMAP_LINEAR:
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                break;
        }
    }
    return texture;
}
exports.generateMipmap = generateMipmap;
