import { vec3, mat4 } from 'gl-matrix';

export interface KeyAction {
  keys: Array<number>;
  action: (moveVec: vec3) => void;
}

export function freenavControls(viewMatrix: mat4, dom: HTMLCanvasElement): () => void {
  let moveId: number;

  const right = vec3.create(),
    up = vec3.create(),
    forward = vec3.create(),
    invViewMatrix = mat4.create(),
    pos = vec3.create(),
    negPos = vec3.create(),
    moveVec = vec3.create(),
    startPos = { x: 0, y: 0 },
    deltaPos = { x: 0, y: 0 },
    moveSpeed = 5,
    moveExtraVec = vec3.create(),
    moveKeys: Array<KeyAction> = [
      { //forward
        keys: [87],
        action: (moveVec: vec3) => {
          extractView();
          vec3.scale(moveExtraVec, forward, moveSpeed);
          vec3.add(moveVec, moveVec, moveExtraVec);
        }
      },
      { //back
        keys: [83],
        action: (moveVec: vec3) => {
          extractView();
          vec3.scale(moveExtraVec, forward, -moveSpeed);
          vec3.add(moveVec, moveVec, moveExtraVec);
        }
      },
      { //left
        keys: [65],
        action: (moveVec: vec3) => {
          extractView();
          vec3.scale(moveExtraVec, right, moveSpeed);
          vec3.add(moveVec, moveVec, moveExtraVec);
        }
      },
      { //right
        keys: [68],
        action: (moveVec: vec3) => {
          extractView();
          vec3.scale(moveExtraVec, right, -moveSpeed);
          vec3.add(moveVec, moveVec, moveExtraVec);
        }
      },
      { //up
        keys: [32],
        action: (moveVec: vec3) => {
          extractView();
          vec3.scale(moveExtraVec, up, -moveSpeed);
          vec3.add(moveVec, moveVec, moveExtraVec);
        }
      },
      { //down
        keys: [17, 67],
        action: (moveVec: vec3) => {
          extractView();
          vec3.scale(moveExtraVec, up, moveSpeed);
          vec3.add(moveVec, moveVec, moveExtraVec);
        }
      }
    ], 
    moveKeysByKey: Record<string, KeyAction> = {},
    moveKeyDown: Array<KeyAction> = [],
    moveKeyPressed: Record<string, boolean> = {},
    extractPosition = () => {
      mat4.invert(invViewMatrix, viewMatrix);
      vec3.set(pos, invViewMatrix[12], invViewMatrix[13], invViewMatrix[14]);
      vec3.negate(negPos, pos);
    },
    extractView = () => {
      vec3.set(right, viewMatrix[0], viewMatrix[4], viewMatrix[8]);
      vec3.set(up, viewMatrix[1], viewMatrix[5], viewMatrix[9]);
      vec3.set(forward, viewMatrix[2], viewMatrix[6], viewMatrix[10]);
    },
    startMove = (e: MouseEvent) => {
      startPos.x = e.pageX;
      startPos.y = e.pageY;
      
      extractPosition();
      
      window.addEventListener('mousemove', mouseMove);
      window.addEventListener('mouseup', mouseUp);
    },
    move = () => {
      moveId = requestAnimationFrame(move);

      if (moveKeyDown.length) {
        vec3.set(moveVec, 0, 0, 0);
        
        moveKeyDown.forEach((moveKey) => {
          moveKey.action(moveVec);
        });
        
        vec3.subtract(pos, pos, moveVec);
        vec3.negate(negPos, pos);
        mat4.translate(viewMatrix, viewMatrix, moveVec);
      }
    },
    mouseMove = (e: MouseEvent) => {
      deltaPos.x = (e.pageX - startPos.x) / dom.width;
      deltaPos.y = (e.pageY - startPos.y) / dom.height;
      
      //TODO: limit the angle of rotation when we rotate around y (need to ensure the up direction remains up)
      
      extractView();
      mat4.translate(viewMatrix, viewMatrix, pos);
      mat4.rotateY(viewMatrix, viewMatrix, deltaPos.x*Math.PI);
      
      extractView();
      mat4.rotate(viewMatrix, viewMatrix, deltaPos.y*Math.PI, right);
      mat4.translate(viewMatrix, viewMatrix, negPos);
      
      startPos.x = e.pageX;
      startPos.y = e.pageY;
    },
    mouseUp = () => {
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseup', mouseUp);
    },
    keyDown = (e: KeyboardEvent) => {
      if (!moveKeyPressed.hasOwnProperty(e.which) && 
      moveKeysByKey.hasOwnProperty(e.which) && 
      moveKeyDown.indexOf(moveKeysByKey[e.which]) < 0) {
        moveKeyPressed[e.which] = true;
        moveKeyDown.push(moveKeysByKey[e.which]);
      }
    },
    keyUp = (e: KeyboardEvent) => {
      if (moveKeyPressed.hasOwnProperty(e.which) &&
      moveKeysByKey.hasOwnProperty(e.which)) {
        delete moveKeyPressed[e.which];
        
        const obj = moveKeysByKey[e.which],
          index = moveKeyDown.indexOf(obj);
        
        if (index>=0) {
          moveKeyDown.splice(index, 1);
        }
      }
    };
  
  moveKeys.forEach((moveKey) => {
    moveKey.keys.forEach((key) => {
      moveKeysByKey[key] = moveKey;
    });
  });
  
  moveId = requestAnimationFrame(move);
  
  dom.addEventListener('mousedown', startMove);
  window.addEventListener('keydown', keyDown);
  window.addEventListener('keyup', keyUp);

  return () => {
    cancelAnimationFrame(moveId);
    
    dom.removeEventListener('mousedown', startMove);
    window.removeEventListener('mousemove', mouseMove);
    window.removeEventListener('mouseup', mouseUp);
    window.removeEventListener('keydown', keyDown);
    window.removeEventListener('keyup', keyUp);
  };
}
