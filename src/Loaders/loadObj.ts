import { Obj } from "../Interfaces/Obj";

import { loadFile } from "./loadFile";
import { dirname } from "../Util/dirname";
import { vec3, vec2 } from "gl-matrix";
import { Material } from "../Interfaces/Material";
import { Group } from "../Interfaces/Group";
import { loadMtl } from "./loadMtl";

const regexp = {
  group: /\bg\s+([^\s]+)\b/,
  vertex: /\bv\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\b/,
  texCoord: /\bvt\s+([^\s]+)\s+([^\s]+)\b/,
  normal: /\bvn\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\b/,
  triangle: /\bf\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\b/,
  mtllib: /\bmtllib\s+(.*)\b/,
  usemtl: /\busemtl\s+(.*)\b/
};

const mapIndex = (item: string): number => {
  return parseInt(item, 10)-1;
};

//parse a .obj file and return a tree of 3d objects
export async function loadObj(url: string): Promise<Obj> {
  const urlDir = dirname(url);
  
  const fileContents = await loadFile(url);
  
  //parse the .obj lines to form the vertex positions, texcoords and normals to render
  const fileLines = fileContents.split("\n");
  
  const normals: Array<vec3> = [],
    texCoords: Array<vec2> = [],
    vertices: Array<Array<number>> = [],
    groups: Record<string, Group> = {},
    positions: Array<vec3> = [],
    indices: Array<number> = [];
  
  let currentObject: Group = {
      indices: []
    },
    materials: Record<string, Material> = {},
    vertexHash: Record<string, number> = {};
    
  fileLines.forEach(async (objLine) => {
    //mtllib
    let matches = objLine.match(regexp.mtllib);
    
    if (matches) {
      const mtlFilename = urlDir + matches[1];
      
      //load the mtl file and associate the material when it is loaded
      materials = { ...materials, ...(await loadMtl(mtlFilename)) };
      
      return;
    }
    
    //usemtl
    matches = objLine.match(regexp.usemtl);
    
    if (matches) {
      currentObject.material = matches[1];
      return;
    }
    
    //groups
    matches = objLine.match(regexp.group);
    
    if (matches) {
      var groupName = matches[1];
      
      currentObject = {
        name: groupName,
        indices: []
      };
      
      groups[groupName] = currentObject;
      
      //do nothing with groups for now
      return;
    }
    
    //positions
    matches = objLine.match(regexp.vertex);
    
    if (matches) {
      var v1 = parseFloat(matches[1]),
        v2 = parseFloat(matches[2]),
        v3 = parseFloat(matches[3]);
      
      positions.push(vec3.fromValues(v1, v2, v3));
      return;
    }
    
    //tex coords
    matches = objLine.match(regexp.texCoord);
    
    if (matches) {
      var u = parseFloat(matches[1]),
        v = parseFloat(matches[2]);
      
      texCoords.push(vec2.fromValues(u, v));
      return;
    }
    
    //normals
    matches = objLine.match(regexp.normal);
    
    if (matches) {
      var v1 = parseFloat(matches[1]),
        v2 = parseFloat(matches[2]),
        v3 = parseFloat(matches[3]);
      
      normals.push(vec3.fromValues(v1, v2, v3));
      return;
    }
    
    //indices
    matches = objLine.match(regexp.triangle);
    
    //TODO: match any size face and triangulate object automatically
    
    
    if (matches) {
      //identify the vertices that we can re-use across multiple triangles
      var coordIndexes = [];
      
      for (var matchIndex=1, maxIndex = Math.min(4, matches.length); matchIndex<maxIndex; matchIndex++) {
        const coord = matches[matchIndex].split('/').map(mapIndex),
          coordHash = coord.join('/');
        
        let coordIndex;
        
        if (coordHash in vertexHash) {
          coordIndex = vertexHash[coordHash];
        } else {
          coordIndex = vertices.push(coord)-1;
          vertexHash[coordHash] = coordIndex;
        }
        
        coordIndexes.push(coordIndex);
      }
      
      currentObject.indices = currentObject.indices.concat(coordIndexes);
      
      return;
    }
  });
  
  //TODO: generate normals using defined smoothing groups if normals are not provided
  
  
  //remove the temporary hash now we are done with it
  vertexHash = null;
  
  //scale our object to fit -1 to 1 in all axis and then re-position to center
  var maxX = Number.MIN_VALUE, 
    maxY = Number.MIN_VALUE, 
    maxZ = Number.MIN_VALUE, 
    minX = Number.MAX_VALUE, 
    minY = Number.MAX_VALUE, 
    minZ = Number.MAX_VALUE;
  
  positions.forEach(function(pos) {
    maxX = Math.max(maxX, pos[0]);
    maxY = Math.max(maxY, pos[1]);
    maxZ = Math.max(maxZ, pos[2]);
    
    minX = Math.min(minX, pos[0]);
    minY = Math.min(minY, pos[1]);
    minZ = Math.min(minZ, pos[2]);
  });
  
  var sizeX = maxX - minX,
    sizeY = maxY - minY,
    sizeZ = maxZ - minZ,
    centerX = sizeX / 2 + minX,
    centerY = sizeY / 2 + minY,
    centerZ = sizeZ / 2 + minZ;
  
  //center the object to zero first
  positions.forEach(function(pos) {
    pos[0] -= centerX;
    pos[1] -= centerY;
    pos[2] -= centerZ;
  });
  
  //then scale down each axis by an factor
  var size = Math.max(sizeX, Math.max(sizeY, sizeZ)),
    downscaleFactor = 1 / size;
  
  positions.forEach(function(pos) {
    pos[0] *= downscaleFactor;
    pos[1] *= downscaleFactor;
    pos[2] *= downscaleFactor;
  });
  
  //TODO: remove unused positions, normals and texCoords
  return {
    positions: positions,
    normals: normals,
    texCoords: texCoords,
    vertices: vertices,
    groups: groups,
    materials: materials
  };
}
