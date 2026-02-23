import { Identifier } from "@/identifier";

export interface FocusParams {
  readonly contentOffset: number;
  readonly nodes: Iterable<Identifier>;
  readonly minContentScale: number;
}
