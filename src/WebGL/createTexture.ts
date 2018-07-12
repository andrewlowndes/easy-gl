
export interface createTextureOptions {
  minFilter: number;
  magFilter: number;
  wrapS: number;
  wrapT: number;
  flipY: boolean;
  level: number;
  internalFormat: number;
  border: number;
  srcFormat: number;
  srcType: number;
  width: number;
  height: number;
}

const defaultOptions = {
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
  height: 0
};

export function createTexture(gl: WebGLRenderingContext, opts: Partial<createTextureOptions>): WebGLTexture {
  opts = {
    ...defaultOptions,
    ...opts
  };
  
  var texture = gl.createTexture();
  
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, opts.flipY);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, opts.wrapS);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, opts.wrapT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, opts.minFilter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, opts.magFilter);
  gl.texImage2D(gl.TEXTURE_2D, opts.level, opts.internalFormat, opts.width, opts.height, opts.border, opts.srcFormat, opts.srcType, null);
  
  return texture;
}
