import { createConstantPriorityFn } from "./create-constant-priority-fn";
import { PriorityFn } from "./priority-fn";

export const standardPriorityFn: PriorityFn = createConstantPriorityFn(0);
