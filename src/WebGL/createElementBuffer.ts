
import { TypedArray } from '../Interfaces/TypedArray';
import { ElementBuffer } from '../Interfaces/ElementBuffer';

export function createElementBuffer(gl: WebGLRenderingContext, data: TypedArray, itemSize: number, drawMode: number): ElementBuffer {
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, drawMode || gl.STATIC_DRAW);
  
  var numItems = data.length / itemSize;
  
  return {
    buffer: buffer,
    itemSize: itemSize,
    numItems: numItems,
    draw: (drawMode, size) => {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
      gl.drawElements(drawMode || gl.TRIANGLES, numItems, size || gl.UNSIGNED_SHORT, 0);
    }
  };
}