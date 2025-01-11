interface ConstantPriority {
  readonly type?: "constant";
  readonly value: number;
}

export type Priority = ConstantPriority;
