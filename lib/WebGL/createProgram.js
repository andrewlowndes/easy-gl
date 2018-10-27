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
        case gl.FLOAT: return (size > 1 ? function (loc, val) { return gl.uniform1fv(loc, val); } : function (loc, val) { return gl.uniform1f(loc, val); });
        case gl.FLOAT_VEC2: return function (loc, val) { return gl.uniform2fv(loc, val); };
        case gl.FLOAT_VEC3: return function (loc, val) { return gl.uniform3fv(loc, val); };
        case gl.FLOAT_VEC4: return function (loc, val) { return gl.uniform4fv(loc, val); };
        case gl.FLOAT_MAT2: return function (loc, val, transpose) { return gl.uniformMatrix2fv(loc, transpose, val); };
        case gl.FLOAT_MAT3: return function (loc, val, transpose) { return gl.uniformMatrix3fv(loc, transpose, val); };
        case gl.FLOAT_MAT4: return function (loc, val, transpose) { return gl.uniformMatrix4fv(loc, transpose, val); };
        default:
        case gl.INT: return (size > 1 ? function (loc, val) { return gl.uniform1iv(loc, val); } : function (loc, val) { return gl.uniform1i(loc, val); });
        case gl.INT_VEC2: return function (loc, val) { return gl.uniform2iv(loc, val); };
        case gl.INT_VEC3: return function (loc, val) { return gl.uniform3iv(loc, val); };
        case gl.INT_VEC4: return function (loc, val) { return gl.uniform4fv(loc, val); };
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
    var setMethod = getUniformMethod(gl, info.type, info.size), location = gl.getUniformLocation(program, info.name);
    var set;
    if (!location) {
        throw new Error('Could not get uniform location for: ' + info.name);
    }
    if (info.type === gl.SAMPLER_2D) {
        set = function (val) {
            gl.activeTexture(gl.TEXTURE0 + textureIndex);
            gl.bindTexture(gl.TEXTURE_2D, val);
            gl.uniform1i(location, textureIndex);
        };
    }
    else {
        set = function (val) {
            setMethod(location, val);
        };
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
        var info = gl.getActiveUniform(shaderProgram, i);
        uniforms[info.name] = createUniform(gl, shaderProgram, info, textureIndex);
        if (info.type === gl.SAMPLER_2D) {
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
            for (var name_1 in hash) {
                if (name_1 in uniforms) {
                    uniforms[name_1].set(hash[name_1]);
                }
            }
        },
        setAttributes: function (hash) {
            for (var name_2 in hash) {
                if (name_2 in attributes) {
                    attributes[name_2].set(hash[name_2]);
                }
            }
        }
    };
}
exports.createProgram = createProgram;
