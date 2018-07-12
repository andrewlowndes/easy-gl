import { ObjBuffers } from '../Interfaces/ObjBuffers';

export function mergeObjBuffers(buffer1: ObjBuffers, buffer2: ObjBuffers) {
  if (!buffer1) return buffer2;
  
  //take the length of the position and increase the indices of the second buffer, then merge the two
  var indicesOffset = buffer1.position.length / 3;
  
  return {
    position: buffer1.position.concat(buffer2.position),
    coords: buffer1.coords.concat(buffer2.coords),
    indices: buffer1.indices.concat(buffer2.indices.map(function(index) {
      return index + indicesOffset;
    }))
  };
}