import { AddEdgeRequest } from "@/graph-controller";

export type ConnectionPreprocessor = (
  request: AddEdgeRequest,
) => AddEdgeRequest | null;
