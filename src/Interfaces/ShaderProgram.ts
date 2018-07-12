import { ShaderUniform } from "./ShaderUniform";
import { ShaderAttribute } from "./ShaderAttribute";

export interface ShaderProgram {
  program: WebGLProgram,
  uniforms: Record<string, ShaderUniform>;
  attributes: Record<string, ShaderAttribute>;
  setUniforms: (hash: Record<string, any>) => void;
  setAttributes: (hash: Record<string, any>) => void;
}
