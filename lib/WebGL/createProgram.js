"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function compileShader(gl, type, src) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS) && !gl.isContextLost()) {
        var lineNum_1 = 1;
        var shaderSrc = src.split("\n").reduce(function (str, line) {
            return str + "\n" + (lineNum_1++) + '. ' + line;
        }, '');
        throw new Error(gl.getShaderInfoLog(shader) + shaderSrc);
    }
    return shader;
}
function getUniformMethod(gl, type, size) {
    switch (type) {
        case gl.FLOAT: return (size > 1 ? gl.uniform1fv : gl.uniform1f);
        case gl.FLOAT_VEC2: return gl.uniform2fv;
        case gl.FLOAT_VEC3: return gl.uniform3fv;
        case gl.FLOAT_VEC4: return gl.uniform4fv;
        case gl.FLOAT_MAT2: return function (loc, val, transpose) { return gl.uniformMatrix2fv(loc, transpose, val); };
        case gl.FLOAT_MAT3: return function (loc, val, transpose) { return gl.uniformMatrix3fv(loc, transpose, val); };
        case gl.FLOAT_MAT4: return function (loc, val, transpose) { return gl.uniformMatrix4fv(loc, transpose, val); };
        default:
        case gl.INT: return (size > 1 ? gl.uniform1iv : gl.uniform1i);
        case gl.INT_VEC2: return gl.uniform2iv;
        case gl.INT_VEC3: return gl.uniform3iv;
        case gl.INT_VEC4: return gl.uniform4fv;
    }
    ;
}
function createAttribute(gl, program, info) {
    var location = gl.getAttribLocation(program, info.name);
    return {
        set: function (val) {
            gl.bindBuffer(gl.ARRAY_BUFFER, val.buffer);
            gl.enableVertexAttribArray(location);
            gl.vertexAttribPointer(location, val.itemSize, val.type, false, 0, 0);
        }
    };
}
function createUniform(gl, program, info, textureIndex) {
    var setMethod = getUniformMethod(gl, info.type, info.size), location = gl.getUniformLocation(program, info.name), set;
    if (info.type === gl.SAMPLER_2D) {
        set = function (val) {
            gl.activeTexture(gl.TEXTURE0 + textureIndex);
            gl.bindTexture(gl.TEXTURE_2D, val);
            gl.uniform1i(location, textureIndex);
        };
    }
    else {
        set = function (val) { return setMethod(location, val); };
    }
    return {
        set: set
    };
}
function createProgram(gl, vertexSrc, fragmentSrc) {
    var vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSrc), fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS) && !gl.isContextLost()) {
        throw new Error("Could not initialise shaders: " + gl.getProgramInfoLog(shaderProgram));
    }
    gl.useProgram(shaderProgram);
    var numUniforms = gl.getProgramParameter(shaderProgram, gl.ACTIVE_UNIFORMS), numAttributes = gl.getProgramParameter(shaderProgram, gl.ACTIVE_ATTRIBUTES);
    var attributes = {}, uniforms = {}, textureIndex = 0;
    for (var i = 0; i < numUniforms; i++) {
        var info_1 = gl.getActiveUniform(shaderProgram, i);
        uniforms[info_1.name] = createUniform(gl, shaderProgram, info_1, textureIndex);
        if (info_1.type === gl.SAMPLER_2D) {
            textureIndex++;
        }
    }
    for (var i = 0; i < numAttributes; i++) {
        var info = gl.getActiveAttrib(shaderProgram, i);
        attributes[info.name] = createAttribute(gl, shaderProgram, info);
    }
    return {
        program: shaderProgram,
        uniforms: uniforms,
        attributes: attributes,
        setUniforms: function (hash) {
            for (var name in hash) {
                if (name in uniforms) {
                    uniforms[name].set(hash[name]);
                }
            }
        },
        setAttributes: function (hash) {
            for (var name in hash) {
                if (name in attributes) {
                    attributes[name].set(hash[name]);
                }
            }
        }
    };
}
exports.createProgram = createProgram;
