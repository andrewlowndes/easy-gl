import { Triangle } from "../Interfaces/Triangle";
import { ObjBuffers } from "../Interfaces/ObjBuffers";

export function convertTrianglesToBufferArrays(triangles: Array<Triangle>): ObjBuffers {
  let position: Array<number> = [],
    coords: Array<number> = [],
    indices: Array<number> = [],
    lastIndex = 0;
  
  //to simplify the shape as much as we can, group the vertices for the triangles
  triangles.forEach((triangle) => {
    const p1 = triangle.p1,
      p2 = triangle.p2,
      p3 = triangle.p3;
    
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
    } else {
      coords = coords.concat([
        0.0, 0.0, 0.0,
        0.0, 0.0, 0.0,
        0.0, 0.0, 0.0
      ]);
    }
    
    indices = indices.concat([lastIndex, lastIndex+1, lastIndex+2]);
    lastIndex+= 3;
  });
  
  return {
    position: position,
    coords: coords,
    indices: indices
  };
}
