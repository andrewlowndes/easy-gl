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
var createTexture_1 = require("./createTexture");
var defaultOptions = {
    width: 0,
    height: 0,
    depth: true,
    stencil: false,
    minFilter: WebGLRenderingContext.NEAREST,
    magFilter: WebGLRenderingContext.NEAREST,
    wrapS: WebGLRenderingContext.CLAMP_TO_EDGE,
    wrapT: WebGLRenderingContext.CLAMP_TO_EDGE,
};
function createFramebuffer(gl, opts) {
    opts = __assign({}, defaultOptions, opts);
    var buffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, buffer);
    var tex = createTexture_1.createTexture(gl, opts);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    var depthStencilTexture;
    if (opts.stencil || opts.depth) {
        var target = opts.stencil ? gl.DEPTH_STENCIL_ATTACHMENT : gl.DEPTH_ATTACHMENT;
        var ext = gl.getExtension('WEBGL_depth_texture');
        if (ext) {
            depthStencilTexture = createTexture_1.createTexture(gl, {
                width: opts.width,
                height: opts.height,
                internalFormat: opts.stencil ? gl.DEPTH_STENCIL : gl.DEPTH_COMPONENT,
                srcFormat: opts.stencil ? gl.DEPTH_STENCIL : gl.DEPTH_COMPONENT,
                srcType: gl.UNSIGNED_INT,
                minFilter: gl.NEAREST,
                magFilter: gl.NEAREST,
                wrapS: gl.CLAMP_TO_EDGE,
                wrapT: gl.CLAMP_TO_EDGE
            });
            gl.bindTexture(gl.TEXTURE_2D, depthStencilTexture);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, target, gl.TEXTURE_2D, tex, 0);
        }
        var renderbuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, opts.stencil ? gl.DEPTH_STENCIL : gl.DEPTH_COMPONENT16, opts.width, opts.height);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, target, gl.RENDERBUFFER, renderbuffer);
    }
    return {
        width: opts.width,
        height: opts.height,
        framebuffer: buffer,
        texture: tex,
        depthStencilTexture: depthStencilTexture
    };
}
exports.createFramebuffer = createFramebuffer;
