"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createElementBuffer(gl, data, itemSize, drawMode) {
    var buffer = gl.createBuffer(), numItems = data.length / itemSize;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, drawMode || gl.STATIC_DRAW);
    return {
        buffer: buffer,
        itemSize: itemSize,
        numItems: numItems,
        draw: function (drawMode, size) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
            gl.drawElements(drawMode || gl.TRIANGLES, numItems, size || gl.UNSIGNED_SHORT, 0);
        }
    };
}
exports.createElementBuffer = createElementBuffer;
