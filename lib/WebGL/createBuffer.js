"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getBufferType(arrayType) {
    switch (arrayType) {
        case 'Int8Array': return WebGLRenderingContext.BYTE;
        case 'Int16Array': return WebGLRenderingContext.SHORT;
        case 'Uint8Array': return WebGLRenderingContext.UNSIGNED_BYTE;
        case 'Uint16Array': return WebGLRenderingContext.UNSIGNED_SHORT;
        case 'Float32Array':
        default: return WebGLRenderingContext.FLOAT;
    }
}
function createBuffer(gl, data, itemSize, drawMode) {
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, drawMode || gl.STATIC_DRAW);
    return {
        type: getBufferType(data.constructor.name),
        buffer: buffer,
        itemSize: itemSize,
        numItems: data.length / itemSize
    };
}
exports.createBuffer = createBuffer;
