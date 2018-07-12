import { vec3 } from "gl-matrix";
export interface Material {
    name?: string;
    ambient?: vec3;
    diffuse?: vec3;
    specular?: vec3;
    intensity?: number;
    transparent?: number;
    illumination?: number;
    ambientMap?: string;
    diffuseMap?: string;
    specularMap?: string;
    intensityMap?: string;
    alphaMap?: string;
    bumpMap?: string;
}
