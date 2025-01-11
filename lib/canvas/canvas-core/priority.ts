type ConstantPriority = number;

type IncrementalPriority = "incremental";

type SharedIncrementalPriority = "shared-incremental";

export type Priority =
  | ConstantPriority
  | IncrementalPriority
  | SharedIncrementalPriority;
