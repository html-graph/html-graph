import { describe, expect, it } from "vitest";
import { createConstantPriorityFn } from "./create-constant-priority-fn";

describe("createConstantPriorityFn", () => {
  it("should return provided constant value", () => {
    const fn = createConstantPriorityFn(10);

    expect(fn()).toBe(10);
  });
});
