export interface Config {
  readonly tileWidth: number;
  readonly tileHeight: number;
  readonly renderer: SVGElement;
  readonly maxViewportScale: number;
}
