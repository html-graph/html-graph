import { Identifier } from "@/identifier";

export interface ViewportNavigatorFocusParams {
  readonly contentOffset: number;
  readonly nodes: Iterable<Identifier>;
  readonly minContentScale: number;
}
