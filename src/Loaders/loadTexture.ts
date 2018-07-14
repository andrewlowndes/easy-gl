import { createTexture } from "../WebGL/createTexture";
import { generateMipmapOptions, generateMipmap } from "../WebGL/generateMipmap";

export interface loadTextureOptions extends Partial<generateMipmapOptions> {
  level: number;
  internalFormat: number;
  border: number;
  srcFormat: number;
  srcType: number;
  mipmap: boolean;
}

const defaultOptions: loadTextureOptions = {
  level: 0,
  internalFormat: WebGLRenderingContext.RGBA,
  border: 0,
  srcFormat: WebGLRenderingContext.RGBA,
  srcType: WebGLRenderingContext.UNSIGNED_BYTE,
  mipmap: false
};

export function loadTexture(gl: WebGLRenderingContext, url: string, opts: Partial<loadTextureOptions>) {
  opts = {
    ...defaultOptions,
    ...opts
  };
  
  const image = new Image();
  
  const texture = createTexture(gl, Object.assign({ width: 1, height: 1 }, opts));
  
  const texObj = {
    texture: texture,
    image: image,
    width: 0,
    height: 0
  };
  
  image.onload = () => {
    texObj.width = image.width;
    texObj.height = image.height;
    
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, opts.level, opts.internalFormat, opts.srcFormat, opts.srcType, image);
    
    if (opts.mipmap) {
      generateMipmap(gl, texture, { width: image.width, height: image.height, ...opts as generateMipmapOptions });
    }
  };
  
  image.src = url;

  return texObj;
}
