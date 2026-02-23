import { waitMacrotask } from "@/mocks";
import { macrotaskScheduleFn } from "./macrotask-schedule-fn";

describe("macrotaskScheduleFn", () => {
  it("should call function in next macrotask", async () => {
    const fn = jest.fn();

    macrotaskScheduleFn(fn);

    expect(fn).not.toHaveBeenCalled();

    await waitMacrotask(0);

    expect(fn).toHaveBeenCalled();
  });
});
