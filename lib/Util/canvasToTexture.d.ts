import { createTextureOptions } from "../WebGL/createTexture";
import { generateMipmapOptions } from "../WebGL/generateMipmap";
export interface canvasToTextureOptions extends Partial<createTextureOptions>, Partial<generateMipmapOptions> {
    mipmap: boolean;
}
export declare function canvasToTexture(gl: WebGLRenderingContext, canvas: HTMLCanvasElement, opts: Partial<canvasToTextureOptions>): WebGLTexture;
