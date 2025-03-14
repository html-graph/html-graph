export interface EdgeRenderPort {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly direction: number;
  readonly portId: unknown;
  readonly nodeId: unknown;
}
