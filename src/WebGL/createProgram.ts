import { ShaderProgram } from "../Interfaces/ShaderProgram";
import { Buffer } from "../Interfaces/Buffer";
import { ShaderUniform } from "../Interfaces/ShaderUniform";
import { ShaderAttribute } from "../Interfaces/ShaderAttribute";

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS) && !gl.isContextLost()) {
    let lineNum = 1;
    
    const shaderSrc = src.split("\n").reduce((str, line) => {
      return str + "\n" + (lineNum++) + '. ' + line;
    }, '');
    
    throw new Error(gl.getShaderInfoLog(shader) + shaderSrc);
  }

  return shader;
}

type Float32List = Float32Array | Array<number>;
type Int32List = Array<number>;

function getUniformMethod(gl: WebGLRenderingContext, type: number, size: number): (loc: WebGLUniformLocation, val: any, transpose?: boolean) => void {
  switch (type) {
    case gl.FLOAT: return (size > 1 ? (loc: WebGLUniformLocation, val: Float32List) => gl.uniform1fv(loc, val) : (loc: WebGLUniformLocation, val: number) => gl.uniform1f(loc, val));
    case gl.FLOAT_VEC2: return (loc: WebGLUniformLocation, val: Float32List) => gl.uniform2fv(loc, val);
    case gl.FLOAT_VEC3: return (loc: WebGLUniformLocation, val: Float32List) => gl.uniform3fv(loc, val);
    case gl.FLOAT_VEC4: return (loc: WebGLUniformLocation, val: Float32List) => gl.uniform4fv(loc, val);
    case gl.FLOAT_MAT2: return (loc: WebGLUniformLocation, val: Float32List, transpose?: boolean) => gl.uniformMatrix2fv(loc, transpose, val);
    case gl.FLOAT_MAT3: return (loc: WebGLUniformLocation, val: Float32List, transpose?: boolean) => gl.uniformMatrix3fv(loc, transpose, val);
    case gl.FLOAT_MAT4: return (loc: WebGLUniformLocation, val: Float32List, transpose?: boolean) => gl.uniformMatrix4fv(loc, transpose, val);
    default: case gl.INT: return (size > 1 ? (loc: WebGLUniformLocation, val: Int32List) => gl.uniform1iv(loc, val) : (loc: WebGLUniformLocation, val: number) => gl.uniform1i(loc, val));
    case gl.INT_VEC2: return (loc: WebGLUniformLocation, val: Int32List) => gl.uniform2iv(loc, val);
    case gl.INT_VEC3: return (loc: WebGLUniformLocation, val: Int32List) => gl.uniform3iv(loc, val);
    case gl.INT_VEC4: return (loc: WebGLUniformLocation, val: Int32List) => gl.uniform4fv(loc, val);
  };
}

function createAttribute(gl: WebGLRenderingContext, program: WebGLProgram, info: WebGLActiveInfo): ShaderAttribute {
  const location = gl.getAttribLocation(program, info.name);
  
  return {
    set: (val: Buffer) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, val.buffer);
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, val.itemSize, val.type, false, 0, 0);
    }
  };
}

function createUniform(gl: WebGLRenderingContext, program: WebGLProgram, info: WebGLActiveInfo, textureIndex: number): ShaderUniform {
  const setMethod = getUniformMethod(gl, info.type, info.size),
    location = gl.getUniformLocation(program, info.name);
  
  let set;

  if (!location) {
    throw new Error('Could not get uniform location for: ' + info.name);
  }
  
  if (info.type === gl.SAMPLER_2D) {
    set = (val: WebGLTexture) => {
      gl.activeTexture(gl.TEXTURE0 + textureIndex);
      gl.bindTexture(gl.TEXTURE_2D, val);
      gl.uniform1i(location, textureIndex);
    };
  } else {
    set = (val: ArrayLike<number> | number) => {
      setMethod(location, val);
    }
  }
  
  return {
    set
  };
}

export function createProgram(gl: WebGLRenderingContext, vertexSrc: string, fragmentSrc: string): ShaderProgram {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSrc),
    fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS) && !gl.isContextLost()) {
    throw new Error("Could not initialise shaders: " + gl.getProgramInfoLog(shaderProgram));
  }
  
  //iterate through the program attributes and uniforms and create location variables for them
  gl.useProgram(shaderProgram);
  
  const numUniforms = gl.getProgramParameter(shaderProgram, gl.ACTIVE_UNIFORMS),
    numAttributes = gl.getProgramParameter(shaderProgram, gl.ACTIVE_ATTRIBUTES);

  let attributes: Record<string, ShaderAttribute> = {},
    uniforms: Record<string, ShaderUniform> = {},
    textureIndex = 0;

  for (let i=0; i<numUniforms; i++) {
    const info = gl.getActiveUniform(shaderProgram, i);
    
    uniforms[info.name] = createUniform(gl, shaderProgram, info, textureIndex);
    
    if (info.type === gl.SAMPLER_2D) {
      textureIndex++;
    }
  }
  
  for (let i=0; i<numAttributes; i++) {
    let info = gl.getActiveAttrib(shaderProgram, i);
    attributes[info.name] = createAttribute(gl, shaderProgram, info);
  }
  
  return {
    program: shaderProgram,
    uniforms: uniforms,
    attributes: attributes,
    setUniforms: (hash: Record<string, any>) => {
      for (let name in hash) {
        if (name in uniforms) {
          uniforms[name].set(hash[name]);
        }
      }
    },
    setAttributes: (hash: Record<string, Buffer>) => {
      for (let name in hash) {
        if (name in attributes) {
          attributes[name].set(hash[name]);
        }
      }
    }
  };
}
