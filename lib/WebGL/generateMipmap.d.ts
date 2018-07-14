export interface generateMipmapOptions {
    minFilter: number;
    magFilter: number;
    wrapS: number;
    wrapT: number;
    flipY: boolean;
    anisotropy: number;
    width: number;
    height: number;
}
export declare function generateMipmap(gl: WebGLRenderingContext, texture: WebGLTexture, opts?: Partial<generateMipmapOptions>): WebGLTexture;
