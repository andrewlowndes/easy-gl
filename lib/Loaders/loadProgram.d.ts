import { ShaderProgram } from "../Interfaces/ShaderProgram";
export declare function loadProgram(gl: WebGLRenderingContext, vertexFile: string, fragmentFile: string): Promise<ShaderProgram>;
