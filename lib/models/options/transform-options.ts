export interface TransformOptions {
  scale?: {
    enabled?: boolean;
    minContent?: number;
    maxContent?: number;
    wheelSensitivity?: number;
  };
  shift?: {
    enabled?: boolean;
  };
}
