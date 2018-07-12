import { Renderer } from "../Interfaces/Renderer";

export function createRenderer(startFunc: () => void, drawFunc: (dt: number) => void): Renderer {
  var requestId: number,
    lastTime = 0,
    dt,
    requestObj = window,
    tick = function(t: number) {
      requestId = requestObj.requestAnimationFrame(tick);
      
      dt = t - lastTime;
      lastTime = t;
      
      drawFunc(dt);
    };
  
  return {
    isPlaying: function() {
      return requestId!==null;
    },
    
    stop: function() {
      requestObj.cancelAnimationFrame(requestId);
      requestId = null;
    },
    
    start: function(renderObj) {
      requestObj = renderObj || requestObj;
      
      startFunc();
      requestId = requestObj.requestAnimationFrame(tick);
    }
  };
}
