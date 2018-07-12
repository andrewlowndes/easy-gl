import { vec3 } from "gl-matrix";

import { Material } from "../Interfaces/Material";
import { loadFile } from "./loadFile";

const regex: Record<string, RegExp> = {
  //mtl
  newmtl: /\bnewmtl\s+(.*)\b/,
  ambient: /\bKa\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\b/,
  diffuse: /\bKd\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\b/,
  specular: /\bKs\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\b/,
  intensity: /\bNs\s+([^\s]+)\b/,
  transparent: /\bd\s+([^\s]+)\b/,
  illumination: /\billum\s+([^\s]+)\b/,
  
  //mtl textures
  ambientMap: /\bmap_Ka\s+([^\s]+)\b/,
  diffuseMap: /\bmap_Kd\s+([^\s]+)\b/,
  specularMap: /\bmap_Ks\s+([^\s]+)\b/,
  intensityMap: /\bmap_Ns\s+([^\s]+)\b/,
  alphaMap: /\bmap_d\s+([^\s]+)\b/,
  bumpMap: /\bmap_bump\s+([^\s]+)\b/
};

function assignMatchVec3(line: string, regexp: RegExp, obj: Material, objKey: string) {
  var matches = line.match(regexp);
  
  if (matches) {
    obj[objKey as keyof Material] = vec3.fromValues(parseFloat(matches[1]), parseFloat(matches[2]), parseFloat(matches[3]));
  }
  
  return obj;
}

function assignMatchVal(line: string, regexp: RegExp, obj: Material, objKey: string) {
  var matches = line.match(regexp);
  
  if (matches) {
    obj[objKey as keyof Material] = matches[1];
  }
  
  return obj;
}

export async function loadMtl(url: string): Promise<Record<string, Material>> {
  const fileContents = await loadFile(url);

  var fileLines = fileContents.split("\n");
  
  var materials: Record<string, Material> = {},
    currentMaterial: Material = {};
  
  fileLines.forEach((line) => {
    //newmtl
    const matches = line.match(regex.newmtl);
    
    if (matches) {
      currentMaterial = {
        name: matches[1]
      };
      
      materials[currentMaterial.name] = currentMaterial;
      return;
    }
    
    ['ambient', 'diffuse', 'specular'].forEach((name: string) => {
      assignMatchVec3(line, regex[name as keyof Record<string, RegExp>], currentMaterial, name);
    });
    
    [
      'intensity', 'transparent', 'illumination', 'ambientMap', 
      'diffuseMap','specularMap', 'intensityMap', 'alphaMap', 'bumpMap'
    ].forEach((name: string) => {
      assignMatchVal(line, regex[name as keyof Record<string, RegExp>], currentMaterial, name);
    });
  });
  
  return materials;
}
