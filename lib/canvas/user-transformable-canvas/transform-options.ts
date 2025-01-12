import { TransformPayload } from "./transform-payload";

export interface TransformOptions {
  readonly scale?: {
    readonly enabled?: boolean;
    readonly min?: number;
    readonly max?: number;
    readonly wheelSensitivity?: number;
  };
  readonly shift?: {
    readonly enabled?: boolean;
  };
  readonly events?: {
    readonly onTransform?: (payload: TransformPayload) => void;
    readonly onBeforeTransform?: (
      payload: TransformPayload,
    ) => TransformPayload | null;
  };
}
