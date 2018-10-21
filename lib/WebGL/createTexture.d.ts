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
    premultiplyAlpha: boolean;
}
export declare const defaultOptions: {
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
    premultiplyAlpha: boolean;
};
export declare function createTexture(gl: WebGLRenderingContext, opts?: Partial<createTextureOptions>): WebGLTexture;
