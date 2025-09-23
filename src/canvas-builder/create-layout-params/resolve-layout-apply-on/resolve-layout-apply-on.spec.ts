import { EventSubject } from "@/event-subject";
import { resolveLayoutApplyOn } from "./resolve-layout-apply-on";

describe("resolveLayoutApplyOn", () => {
  it("should resolve specified topologyChangeTimeout strategy", () => {
    const params = resolveLayoutApplyOn({
      type: "topologyChangeTimeout",
    });

    expect(params).toEqual({
      type: "topologyChangeTimeout",
    });
  });

  it("should resolve topologyChangeTimeout strategy by default", () => {
    const params = resolveLayoutApplyOn(undefined);

    expect(params).toEqual({
      type: "topologyChangeTimeout",
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
