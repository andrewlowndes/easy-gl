export function dirname(path: string): string {
  return path.match(/.*\//)[0].toString();
};
