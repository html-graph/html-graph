import { CenterFn } from "@/center-fn";

export interface GenericStoreNode<T> {
  readonly element: HTMLElement;
  readonly payload: {
    x: T;
    y: T;
    centerFn: CenterFn;
    priority: number;
  };
  readonly ports: Map<unknown, HTMLElement>;
}
