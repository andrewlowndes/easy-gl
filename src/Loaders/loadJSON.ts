import { loadFile } from "./loadFile";

export async function loadJSON<T = {}>(url: string): Promise<T> {
  return JSON.parse(await loadFile(url));
}
