import { TreeSpans } from "../tree-spans";

export interface AggregatedSubtreeResult {
  readonly childOffsets: readonly number[];
  readonly subtreeSpans: TreeSpans;
}
