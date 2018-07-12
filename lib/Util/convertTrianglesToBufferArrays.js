"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function convertTrianglesToBufferArrays(triangles) {
    var position = [], coords = [], indices = [], lastIndex = 0;
    triangles.forEach(function (triangle) {
        var p1 = triangle.p1, p2 = triangle.p2, p3 = triangle.p3;
        position = position.concat([
            p1[0], p1[1], 0.0,
            p2[0], p2[1], 0.0,
            p3[0], p3[1], 0.0
        ]);
        if (triangle.curve) {
            coords = coords.concat([
                -1.0, 1.0, triangle.curve,
                0.0, -1.0, triangle.curve,
                1.0, 1.0, triangle.curve
            ]);
        }
        else {
            coords = coords.concat([
                0.0, 0.0, 0.0,
                0.0, 0.0, 0.0,
                0.0, 0.0, 0.0
            ]);
        }
        indices = indices.concat([lastIndex, lastIndex + 1, lastIndex + 2]);
        lastIndex += 3;
    });
    return {
        position: position,
        coords: coords,
        indices: indices
    };
}
exports.convertTrianglesToBufferArrays = convertTrianglesToBufferArrays;
