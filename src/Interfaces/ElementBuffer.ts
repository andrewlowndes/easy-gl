export interface ElementBuffer {
  buffer: WebGLBuffer,
  itemSize: number;
  numItems: number;
  draw: (drawMode?: number, size?: number) => void;
}
