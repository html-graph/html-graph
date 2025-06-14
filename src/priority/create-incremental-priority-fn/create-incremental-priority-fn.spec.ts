import { createIncrementalPriorityFn } from "./create-incremental-priority-fn";

describe("createIncrementalPriorityFn", () => {
  it("should return 0 as first value", () => {
    const fn = createIncrementalPriorityFn();

    expect(fn()).toBe(0);
  });

  it("should return 1 as second value", () => {
    const fn = createIncrementalPriorityFn();

    fn();

    expect(fn()).toBe(1);
  });
});
