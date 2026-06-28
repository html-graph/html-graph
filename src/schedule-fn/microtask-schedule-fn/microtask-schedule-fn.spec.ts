import { waitMicrotask } from "@/mocks";
import { microtaskScheduleFn } from "./microtask-schedule-fn";

describe("microtaskScheduleFn", () => {
  it("should call function in next microtask", async () => {
    const fn = vi.fn();

    microtaskScheduleFn(fn);

    expect(fn).not.toHaveBeenCalled();

    await waitMicrotask();

    expect(fn).toHaveBeenCalled();
  });
});
