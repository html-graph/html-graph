import { describe, expect, it, vi } from "vitest";
import { immediateScheduleFn } from "./immediate-schedule-fn";

describe("immediateScheduleFn", () => {
  it("should call function immediately", () => {
    const fn = vi.fn();

    immediateScheduleFn(fn);

    expect(fn).toHaveBeenCalled();
  });
});
