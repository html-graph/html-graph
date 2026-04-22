import { EventSubject } from "@/event-subject";
import { resolveLayoutApplyOn } from "./resolve-layout-apply-on";
import { macrotaskScheduleFn, microtaskScheduleFn } from "@/schedule-fn";

describe("resolveLayoutApplyOn", () => {
  it("should resolve topologyChangeMicrotask strategy by default", async () => {
    const params = resolveLayoutApplyOn(undefined);

    expect(
      params.type === "topologyChangeSchedule" &&
        params.schedule === microtaskScheduleFn,
    ).toBe(true);
  });

  it("should resolve topologyChangeMacrotask strategy", async () => {
    const params = resolveLayoutApplyOn({ type: "topologyChangeMacrotask" });

    expect(
      params.type === "topologyChangeSchedule" &&
        params.schedule === macrotaskScheduleFn,
    ).toBe(true);
  });

  it("should resolve trigger strategy", () => {
    const trigger = new EventSubject<void>();

    const params = resolveLayoutApplyOn(trigger);

    expect(params).toEqual({
      type: "trigger",
      trigger,
    });
  });

  it("should resolve topologyChangeMicrotask strategy", async () => {
    const params = resolveLayoutApplyOn("topologyChangeMicrotask");

    expect(
      params.type === "topologyChangeSchedule" &&
        params.schedule === microtaskScheduleFn,
    ).toBe(true);
  });
});
