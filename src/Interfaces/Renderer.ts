export interface Renderer {
  isPlaying: () => void;
  stop: () => void;
  start: (renderObj: Window) => void;
}