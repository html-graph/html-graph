import { AddEdgeRequest } from "@/graph-controller";

export const defaults = Object.freeze({
  connectionAllowedVerifier: () => true,
  connectionPreprocessor: (request: AddEdgeRequest) => request,
});
