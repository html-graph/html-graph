export interface GenericStorePort {
  readonly element: HTMLElement;
  readonly payload: {
    direction: number;
  };
  readonly nodeId: unknown;
}
