
import { TypedArray } from '../Interfaces/TypedArray';
import { ElementBuffer } from '../Interfaces/ElementBuffer';

export function createElementBuffer(gl: WebGLRenderingContext, data: TypedArray, itemSize: number, drawMode?: number): ElementBuffer {
  const buffer = gl.createBuffer(),
    numItems = data.length / itemSize;

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, drawMode || gl.STATIC_DRAW);
  
  return {
    buffer,
    itemSize,
    numItems,
    draw: (drawMode?: number, size?: number) => {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
      gl.drawElements(drawMode || gl.TRIANGLES, numItems, size || gl.UNSIGNED_SHORT, 0);
    }
  };
}