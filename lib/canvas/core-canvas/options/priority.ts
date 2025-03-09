import { PriorityFn } from "@/priority";

type ConstantPriority = number;

type IncrementalPriority = "incremental";

type SharedIncrementalPriority = "shared-incremental";

type CustomPriority = PriorityFn;

export type Priority =
  | ConstantPriority
  | IncrementalPriority
  | SharedIncrementalPriority
  | CustomPriority;
