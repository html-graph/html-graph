import { immediateScheduleFn } from "./immediate-schedule-fn";

describe("immediateScheduleFn", () => {
  it("should call function immediately", () => {
    const fn = jest.fn();

    immediateScheduleFn(fn);

    expect(fn).toHaveBeenCalled();
  });
});
