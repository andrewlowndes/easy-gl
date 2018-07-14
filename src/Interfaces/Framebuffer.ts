export interface Framebuffer {
  width: number;
  height: number;
  framebuffer: WebGLFramebuffer;
  texture: WebGLTexture;
  depthStencilTexture?: WebGLTexture;
}
