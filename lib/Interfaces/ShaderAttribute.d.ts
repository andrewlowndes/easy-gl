import { Buffer } from "./Buffer";
export interface ShaderAttribute {
    set: (val: Buffer) => void;
}
