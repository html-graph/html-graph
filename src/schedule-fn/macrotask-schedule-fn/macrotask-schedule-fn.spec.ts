import { describe, expect, it, vi } from "vitest";
import { waitMacrotask } from "@/mocks/wait-macrotask.mock";
import { macrotaskScheduleFn } from "./macrotask-schedule-fn";

describe("macrotaskScheduleFn", () => {
  it("should call function in next macrotask", async () => {
    const fn = vi.fn();

    macrotaskScheduleFn(fn);

    expect(fn).not.toHaveBeenCalled();

    await waitMacrotask(0);

    expect(fn).toHaveBeenCalled();
  });
});
