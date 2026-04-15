import { AddEdgeRequest } from "@/graph-controller";

export const defaults = Object.freeze({
  connectionTypeResolver: () => "direct",
  connectionPreprocessor: (request: AddEdgeRequest) => request,
  connectionAllowedVerifier: () => true,
  mouseEventVerifier: (event: MouseEvent): boolean => event.button === 0,
  noopFn: () => {},
});
