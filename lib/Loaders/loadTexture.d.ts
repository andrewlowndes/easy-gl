import { generateMipmapOptions } from "../WebGL/generateMipmap";
export interface loadTextureOptions extends Partial<generateMipmapOptions> {
    level: number;
    internalFormat: number;
    border: number;
    srcFormat: number;
    srcType: number;
    mipmap: boolean;
}
export declare function loadTexture(gl: WebGLRenderingContext, url: string, opts: Partial<loadTextureOptions>): {
    texture: WebGLTexture;
    image: HTMLImageElement;
    width: number;
    height: number;
};
