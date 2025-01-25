export interface EdgeShape {
  readonly svg: SVGSVGElement;

  update(
    width: number,
    height: number,
    flipX: number,
    flipY: number,
    fromDir: number,
    toDir: number,
  ): void;
}
