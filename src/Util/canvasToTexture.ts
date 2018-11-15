import { createTexture, createTextureOptions } from "../WebGL/createTexture";
import { generateMipmap, generateMipmapOptions } from "../WebGL/generateMipmap";

export interface canvasToTextureOptions extends Partial<createTextureOptions>, Partial<generateMipmapOptions> {
  mipmap: boolean;
}

const defaultCanvasToTextureOptions: canvasToTextureOptions = {
  level: 0,
  internalFormat: WebGLRenderingContext.RGBA,
  border: 0,
  srcFormat: WebGLRenderingContext.RGBA,
  srcType: WebGLRenderingContext.UNSIGNED_BYTE,
  mipmap: false
};

export function canvasToTexture(gl: WebGLRenderingContext, canvas: HTMLCanvasElement, opts: Partial<canvasToTextureOptions>): WebGLTexture {
  opts = { ...defaultCanvasToTextureOptions, ...opts };

  const texture = createTexture(gl, Object.assign({ width: 1, height: 1 }, opts));
  
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, opts.level, opts.internalFormat, opts.srcFormat, opts.srcType, canvas);
  
  if (opts.mipmap) {
    generateMipmap(gl, texture, Object.assign({ width: canvas.width, height: canvas.height }, opts));
  }

  return texture;
}
