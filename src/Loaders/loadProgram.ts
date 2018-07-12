import { ShaderProgram } from "../Interfaces/ShaderProgram";
import { loadFile } from "./loadFile";
import { createProgram } from "../WebGL/createProgram";

export async function loadProgram(gl: WebGLRenderingContext, vertexFile: string, fragmentFile: string): Promise<ShaderProgram> {
  const sources = await Promise.all([loadFile(vertexFile), loadFile(fragmentFile)]);
  
  return createProgram(gl, sources[0], sources[1])
}
