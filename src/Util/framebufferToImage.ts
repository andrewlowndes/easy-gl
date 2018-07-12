export function framebufferToImage(gl: WebGLRenderingContext, framebuffer: WebGLFramebuffer, width: number, height: number): string {
  const data = new Uint8Array(width * height * 4);
  
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);
  
  // Create a 2D canvas to store the result 
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  // Copy the pixels to a 2D canvas
  const g = canvas.getContext('2d'),
    imageData = g.createImageData(width, height);
  
  imageData.data.set(data);
  g.putImageData(imageData, 0, 0);
  g.globalCompositeOperation = 'copy';
  g.scale(1,-1);
  g.translate(0, -height);
  g.drawImage(canvas, 0,0);
  
  //we can use this url 
  return canvas.toDataURL('image/png');
}
