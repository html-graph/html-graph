export interface StorePort {
  readonly element: HTMLElement;
  readonly payload: {
    direction: number;
  };
  readonly nodeId: unknown;
}
