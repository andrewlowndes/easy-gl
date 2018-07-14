import { vec3, vec2 } from "gl-matrix";

import { Material } from "./Material";
import { Group } from "./Group";

export interface Obj {
  positions: Array<vec3>,
  normals?: Array<vec3>,
  texCoords?: Array<vec2>,
  vertices: Array<Array<number>>,
  groups?: Record<string, Group>,
  materials?: Record<string, Material>;
}
