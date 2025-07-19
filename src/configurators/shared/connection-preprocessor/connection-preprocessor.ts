import { AddEdgeRequest } from "@/canvas";

export type ConnectionPreprocessor = (
  request: AddEdgeRequest,
) => AddEdgeRequest | null;
