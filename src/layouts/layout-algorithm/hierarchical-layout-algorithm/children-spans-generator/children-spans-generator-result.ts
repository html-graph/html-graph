import { Identifier } from "@/identifier";

export interface ChildrenSpansGeneratorResult {
  readonly radii: ReadonlyMap<Identifier, number>;
  readonly deltas: ReadonlyMap<Identifier, number>;
}
