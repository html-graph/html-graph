export interface MarkPortRequest {
  readonly portId: unknown | undefined;
  readonly element: HTMLElement;
  readonly nodeId: unknown;
  readonly direction: number | undefined;
}
