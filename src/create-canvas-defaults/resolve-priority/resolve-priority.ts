import {
  createConstantPriorityFn,
  createIncrementalPriorityFn,
  PriorityFn,
  standardPriorityFn,
} from "@/priority";
import { Priority } from "../priority";
import { Priorities } from "./priorities";

export const resolvePriority: (
  nodesPriority: Priority | undefined,
  edgesPriority: Priority | undefined,
) => Priorities = (
  nodesPriority: Priority | undefined,
  edgesPriority: Priority | undefined,
) => {
  let nodesPriorityFn: PriorityFn = standardPriorityFn;
  let edgesPriorityFn: PriorityFn = standardPriorityFn;

  const sharedFn = createIncrementalPriorityFn();

  if (nodesPriority === "incremental") {
    nodesPriorityFn = sharedFn;
  }

  if (edgesPriority === "incremental") {
    edgesPriorityFn = sharedFn;
  }

  if (typeof nodesPriority === "number") {
    nodesPriorityFn = createConstantPriorityFn(nodesPriority);
  }

  if (typeof edgesPriority === "number") {
    edgesPriorityFn = createConstantPriorityFn(edgesPriority);
  }

  if (typeof nodesPriority === "function") {
    nodesPriorityFn = nodesPriority;
  }

  if (typeof edgesPriority === "function") {
    edgesPriorityFn = edgesPriority;
  }

  return {
    nodesPriorityFn,
    edgesPriorityFn,
  };
};
