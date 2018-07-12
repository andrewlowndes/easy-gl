export function createContext(canvas: HTMLCanvasElement, opts: WebGLContextAttributes, extensions: Array<string>): WebGLRenderingContext {
  let gl: WebGLRenderingContext;
  
  const pixelRatio = window.devicePixelRatio || 1,
    updateSize = () => {
      canvas.width = pixelRatio * canvas.clientWidth;
      canvas.height = pixelRatio * canvas.clientHeight;
    };
  
  try {
    gl = canvas.getContext('webgl', opts) || canvas.getContext('experimental-webgl', opts);
    
    if (extensions) {
      extensions.forEach((extension) => {
        if (!gl.getSupportedExtensions().indexOf(name) || !gl.getExtension(extension)) {
          console.log('Could not enable extension: ' + extension);
        }
      });
    }
    
    updateSize();
    
    window.addEventListener('resize', updateSize);
  } catch (e) {}
  
  if (!gl) {
    throw new Error("Could not initialise WebGL");
  }
  
  return gl;
}
