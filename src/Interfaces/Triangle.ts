import { vec3 } from "gl-matrix";

export interface Triangle {
  p1: vec3;
  p2: vec3;
  p3: vec3;
  curve: number;
}
