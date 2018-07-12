import { TypedArray } from "../Interfaces/TypedArray";
import { Buffer } from "../Interfaces/Buffer";

function getBufferType(arrayType: string): number {
  switch (arrayType) {
    case 'Int8Array': return WebGLRenderingContext.BYTE;
    case 'Int16Array': return WebGLRenderingContext.SHORT;
    case 'Uint8Array':  return WebGLRenderingContext.UNSIGNED_BYTE;
    case 'Uint16Array': return WebGLRenderingContext.UNSIGNED_SHORT;
    case 'Float32Array': default: return WebGLRenderingContext.FLOAT;
  }
}

export function createBuffer(gl: WebGLRenderingContext, data: TypedArray, itemSize: number, drawMode: number): Buffer {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, drawMode || gl.STATIC_DRAW);
  
  return {
    type: getBufferType(data.constructor.name),
    buffer: buffer,
    itemSize: itemSize,
    numItems: data.length / itemSize
  };
}
