import { TransformPayload } from "./transform-payload";

export interface TransformOptions {
  scale?: {
    enabled?: boolean;
    min?: number;
    max?: number;
    wheelSensitivity?: number;
  };
  shift?: {
    enabled?: boolean;
  };
  events?: {
    onTransform?: (payload: TransformPayload) => void;
    onBeforeTransform?: (payload: TransformPayload) => boolean;
  };
}
