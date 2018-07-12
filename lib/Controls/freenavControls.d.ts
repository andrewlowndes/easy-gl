import { vec3, mat4 } from 'gl-matrix';
export interface KeyAction {
    keys: Array<number>;
    action: (moveVec: vec3) => void;
}
export declare function freenavControls(viewMatrix: mat4, dom: HTMLCanvasElement): () => void;
