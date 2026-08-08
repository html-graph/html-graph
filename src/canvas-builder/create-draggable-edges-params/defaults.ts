import { AddEdgeRequest } from "@/graph-controller";

export const defaults = Object.freeze({
  connectionAllowedVerifier: () => true,
  connectionPreprocessor: (request: AddEdgeRequest) => request,
  mouseDownEventVerifier: (event: MouseEvent): boolean => event.button === 0,
  mouseUpEventVerifier: (event: MouseEvent): boolean => event.button === 0,
});
