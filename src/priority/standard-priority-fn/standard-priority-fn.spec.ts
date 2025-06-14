import { standardPriorityFn } from "./standard-priority-fn";

describe("standardPriorityFn", () => {
  it("should have 0 as first value", () => {
    const fn = standardPriorityFn;

    expect(fn()).toBe(0);
  });

  it("should have 0 as second value", () => {
    const fn = standardPriorityFn;

    fn();

    expect(fn()).toBe(0);
  });
});
