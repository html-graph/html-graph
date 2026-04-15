import { AddEdgeRequest } from "@/graph-controller";

/**
 * @deprecated
 * connection preprocessor should not return null
 */
type ConnectionPreprocessorNullResponse = null;

export type ConnectionPreprocessor = (
  request: AddEdgeRequest,
) => AddEdgeRequest | ConnectionPreprocessorNullResponse;
