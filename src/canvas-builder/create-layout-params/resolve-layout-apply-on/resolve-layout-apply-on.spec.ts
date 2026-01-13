import { EventSubject } from "@/event-subject";
import { resolveLayoutApplyOn } from "./resolve-layout-apply-on";

describe("resolveLayoutApplyOn", () => {
  it("should resolve specified legacy topologyChangeTimeout strategy", () => {
    const params = resolveLayoutApplyOn({
      type: "topologyChangeTimeout",
    });

    expect(params).toEqual({
      type: "topologyChangeMacrotask",
    });
  });

  it("should resolve specified topologyChangeMacrotask strategy", () => {
    const params = resolveLayoutApplyOn({
      type: "topologyChangeMacrotask",
    });

    expect(params).toEqual({
      type: "topologyChangeMacrotask",
    });
  });

  it("should resolve topologyChangeMicrotask strategy by default", () => {
    const params = resolveLayoutApplyOn(undefined);

    expect(params).toEqual({
      type: "topologyChangeMicrotask",
    });
  });

  it("should resolve manual strategy", () => {
    const trigger = new EventSubject<void>();

    const params = resolveLayoutApplyOn(trigger);

    expect(params).toEqual({
      type: "manual",
      trigger,
    });
  });
});
