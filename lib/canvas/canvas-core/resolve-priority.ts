import {
  createConstantPriorityFn,
  createIncrementalPriorityFn,
  PriorityFn,
  standardPriorityFn,
} from "@/priority";
import { Priority } from "./priority";

export const resolvePriority: (
  nodesPriority: Priority | undefined,
  edgesPriority: Priority | undefined,
) => [PriorityFn, PriorityFn] = (
  nodesPriority: Priority | undefined,
  edgesPriority: Priority | undefined,
) => {
  const res: [PriorityFn, PriorityFn] = [
    standardPriorityFn,
    standardPriorityFn,
  ];

  if (nodesPriority === "incremental") {
    res[0] = createIncrementalPriorityFn();
  }

  if (edgesPriority === "incremental") {
    res[1] = createIncrementalPriorityFn();
  }

  const sharedFn = createIncrementalPriorityFn();

  if (nodesPriority === "shared-incremental") {
    res[0] = sharedFn;
  }

  if (edgesPriority === "shared-incremental") {
    res[1] = sharedFn;
  }

  if (typeof nodesPriority === "number") {
    res[0] = createConstantPriorityFn(nodesPriority);
  }

  if (typeof edgesPriority === "number") {
    res[1] = createConstantPriorityFn(edgesPriority);
  }

  return res;
};
