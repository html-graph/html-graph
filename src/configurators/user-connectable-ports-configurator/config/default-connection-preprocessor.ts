import { ConnectionPreprocessor } from "./connection-preprocessor";

export const defaultConnectionPreprocessor: ConnectionPreprocessor = (
  request,
) => request;
