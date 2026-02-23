import { EventSubject } from "@/event-subject";
import { createLayoutParams } from "../../create-layout-params";
import { resolveLayoutFocusSchedule } from "./resolve-layout-focus-schedule";
import { immediateScheduleFn, microtaskScheduleFn } from "@/schedule-fn";

describe("resolveLayoutFocusSchedule", () => {
  it("should resolve immediate schedule when trigger application strategy provided", () => {
    const params = createLayoutParams({ applyOn: new EventSubject() });

    expect(resolveLayoutFocusSchedule(params)).toBe(immediateScheduleFn);
  });

  it("should resolve specified schedule when topology change microtask application strategy provided", () => {
    const params = createLayoutParams({
      applyOn: { type: "topologyChangeMicrotask" },
    });

    expect(resolveLayoutFocusSchedule(params)).toBe(microtaskScheduleFn);
  });
});
