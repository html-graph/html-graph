export interface EdgeRenderPort {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly direction: number;
  /**
   * @deprecated
   * use category instead
   */
  readonly portId: unknown;
  /**
   * @deprecated
   * use category instead
   */
  readonly nodeId: unknown;
}
