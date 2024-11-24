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
}
