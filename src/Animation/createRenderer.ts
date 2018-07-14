import { Renderer } from "../Interfaces/Renderer";

export function createRenderer(startFunc: () => void, drawFunc: (dt: number) => void): Renderer {
  let requestId: number,
    lastTime = 0,
    dt,
    requestObj = window;
    
  const tick = (t: number) => {
    requestId = requestObj.requestAnimationFrame(tick);
    
    dt = t - lastTime;
    lastTime = t;
    
    drawFunc(dt);
  };
  
  return {
    isPlaying: () => {
      return requestId!==null;
    },
    
    stop: () => {
      requestObj.cancelAnimationFrame(requestId);
      requestId = null;
    },
    
    start: (renderObj) => {
      requestObj = renderObj || requestObj;
      
      startFunc();
      requestId = requestObj.requestAnimationFrame(tick);
    }
  };
}
