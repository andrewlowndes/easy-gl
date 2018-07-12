"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function mergeObjBuffers(buffer1, buffer2) {
    if (!buffer1)
        return buffer2;
    var indicesOffset = buffer1.position.length / 3;
    return {
        position: buffer1.position.concat(buffer2.position),
        coords: buffer1.coords.concat(buffer2.coords),
        indices: buffer1.indices.concat(buffer2.indices.map(function (index) {
            return index + indicesOffset;
        }))
    };
}
exports.mergeObjBuffers = mergeObjBuffers;
