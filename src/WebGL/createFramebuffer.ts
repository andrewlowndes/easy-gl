import { Framebuffer } from "../Interfaces/Framebuffer";
import { createTexture } from "./createTexture";

export interface createFramebufferOptions {
  width: number;
  height: number;
  depth: boolean;
  stencil: boolean;
  minFilter: number;
  magFilter: number;
  wrapS: number;
  wrapT: number;
}

const defaultOptions = {
  width: 0,
  height: 0,
  depth: true,
  stencil: false,
  minFilter: WebGLRenderingContext.NEAREST,
  magFilter: WebGLRenderingContext.NEAREST,
  wrapS: WebGLRenderingContext.CLAMP_TO_EDGE,
  wrapT: WebGLRenderingContext.CLAMP_TO_EDGE,
};

export function createFramebuffer(gl: WebGLRenderingContext, opts?: Partial<createFramebufferOptions>): Framebuffer {
  opts = {
    ...defaultOptions,
    ...opts
  };
  
  const buffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, buffer);
  
  const tex = createTexture(gl, opts);
  
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  
  let depthStencilTexture;
  
  if (opts.stencil || opts.depth) {
    const target = opts.stencil ? gl.DEPTH_STENCIL_ATTACHMENT : gl.DEPTH_ATTACHMENT;
    
    const ext = gl.getExtension('WEBGL_depth_texture');
    
    if (ext) {
      depthStencilTexture = createTexture(gl, {
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
    
    const renderbuffer = gl.createRenderbuffer();
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
