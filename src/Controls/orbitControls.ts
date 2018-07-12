import { mat4, vec3, vec2 } from "gl-matrix";

export function orbitControls(viewMatrix: mat4, dom: HTMLCanvasElement): () => void {
  const pos = vec3.create(),
    up = vec3.fromValues(0.0, 1.0, 0.0),
    center = vec3.fromValues(0.0, 0.0, 0.0),
    scaleAmount = 0.1,
    moveXAmount = 1.0,
    moveYAmount = 1.0,
    rotateAmount = Math.PI,
    startPos = vec2.create(),
    newPos = vec2.create(),
    diffPos = vec2.create(),
    domSize = vec2.fromValues(dom.clientWidth, dom.clientHeight),
    tempPos = vec3.create(),
    tempCenter = vec3.create(),
    dirVec = vec3.create(),
    rightVec = vec3.create(),
    rotateMat = mat4.create(),
    moveRight = vec3.create(),
    moveUp = vec3.create(),
    moveOffset = vec3.create(),
    moveStartFunc = (e: MouseEvent) => {
      window.addEventListener('mousemove', moveFunc);
      window.addEventListener('mouseup', moveEndFunc);
      
      vec2.set(startPos, e.pageX, e.pageY);
    },
    moveFunc = (e: MouseEvent) => {
      vec2.set(newPos, e.pageX, e.pageY);
      vec2.subtract(diffPos, newPos, startPos);
      vec2.divide(diffPos, diffPos, domSize);
      vec2.scale(diffPos, diffPos, rotateAmount);
      
      vec3.copy(tempPos, pos);
      vec3.copy(tempCenter, center);
      
      vec3.negate(dirVec, pos);
      vec3.cross(rightVec, dirVec, up);
      vec3.normalize(rightVec, rightVec);
      
      if (e.buttons === 1) { //rotate
        mat4.identity(rotateMat);
        mat4.rotate(rotateMat, rotateMat, -diffPos[0], up);
        mat4.rotate(rotateMat, rotateMat, -diffPos[1], rightVec);
        
        vec3.transformMat4(tempPos, tempPos, rotateMat);
      } else if (e.buttons === 2) { //translate
        vec3.copy(moveRight, rightVec);
        vec3.scale(moveRight, moveRight, moveXAmount * -diffPos[0]);
        
        vec3.copy(moveUp, up);
        vec3.scale(moveUp, moveUp, moveYAmount * diffPos[1]);
        
        vec3.set(moveOffset, 0, 0, 0);
        vec3.add(moveOffset, moveOffset, moveRight);
        vec3.add(moveOffset, moveOffset, moveUp);
        
        vec3.add(tempPos, tempPos, moveOffset);
        vec3.add(tempCenter, tempCenter, moveOffset);
      }
      
      mat4.lookAt(viewMatrix, tempPos, tempCenter, up);
    },
    moveEndFunc = () => {
      window.removeEventListener('mousemove', moveFunc);
      window.removeEventListener('mouseup', moveEndFunc);
      
      vec3.copy(pos, tempPos);
      vec3.copy(center, tempCenter);
    },
    zoom = (e: MouseWheelEvent) => {
      vec3.scale(pos, pos, 1 + (e.deltaY > 0 ? scaleAmount : -scaleAmount));
      mat4.lookAt(viewMatrix, pos, center, up);
    },
    removeContextMenu = (e: PointerEvent) => {
      e.preventDefault();
    };
  
  mat4.getTranslation(pos, viewMatrix);
  vec3.negate(pos, pos);
  
  dom.addEventListener('mousedown', moveStartFunc);
  dom.addEventListener('wheel', zoom);
  dom.addEventListener("contextmenu", removeContextMenu, false);

  return () => {
    dom.removeEventListener('mousedown', moveStartFunc);
    dom.removeEventListener('wheel', zoom);
    dom.removeEventListener("contextmenu", removeContextMenu);
    window.removeEventListener('mousemove', moveFunc);
    window.removeEventListener('mouseup', moveEndFunc);
  };
}
