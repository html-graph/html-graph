import { Identifier } from "@/identifier";

export interface ViewportFocusParams {
  readonly contentOffset: number;
  readonly nodes: Iterable<Identifier>;
  readonly minContentScale: number;
}
