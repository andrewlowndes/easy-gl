import { Framebuffer } from "../Interfaces/Framebuffer";
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
export declare function createFramebuffer(gl: WebGLRenderingContext, opts: Partial<createFramebufferOptions>): Framebuffer;
