import { immediateScheduleFn } from "@/schedule-fn";
import { ViewportControllerParams } from "../viewport-controller-params";
import { createFocusParams } from "./create-focus-params";
import { FocusParams } from "./focus-params";

const controllerParams: ViewportControllerParams = {
  focus: {
    minContentScale: 0.5,
    contentOffset: 100,
    schedule: immediateScheduleFn,
    animationDuration: 100,
  },
};

describe("createFocusParams", () => {
  it("should configure default minimum content scale", () => {
    const params: FocusParams = createFocusParams({}, controllerParams);

    expect(params.minContentScale).toBe(0.5);
  });

  it("should configure specified minimum content scale", () => {
    const params: FocusParams = createFocusParams(
      {
        minContentScale: 0.3,
      },
      controllerParams,
    );

    expect(params.minContentScale).toBe(0.3);
  });

  it("should configure default minimum content scale when using brief signature", () => {
    const params: FocusParams = createFocusParams([], controllerParams);

    expect(params.minContentScale).toBe(0.5);
  });

  it("should configure default content offset", () => {
    const params: FocusParams = createFocusParams({}, controllerParams);

    expect(params.contentOffset).toBe(100);
  });

  it("should configure default content offset when using brief signature", () => {
    const params: FocusParams = createFocusParams([], controllerParams);

    expect(params.contentOffset).toBe(100);
  });

  it("should configure specified content offset", () => {
    const params: FocusParams = createFocusParams(
      { contentOffset: 50 },
      controllerParams,
    );

    expect(params.contentOffset).toBe(50);
  });

  it("should configure default nodes list", () => {
    const params: FocusParams = createFocusParams({}, controllerParams);

    expect(params.nodes).toEqual([]);
  });

  it("should configure default nodes list when using brief signature", () => {
    const params: FocusParams = createFocusParams([], controllerParams);

    expect(params.nodes).toEqual([]);
  });

  it("should configure specified nodes list", () => {
    const params: FocusParams = createFocusParams(
      { nodes: ["node-1"] },
      controllerParams,
    );

    expect(params.nodes).toEqual(["node-1"]);
  });

  it("should configure specified nodes list when using brief signature", () => {
    const params: FocusParams = createFocusParams(["node-1"], controllerParams);

    expect(params.nodes).toEqual(["node-1"]);
  });

  it("should configure default animation duration when iterable specified", () => {
    const params: FocusParams = createFocusParams([], controllerParams);

    expect(params.animationDuration).toBe(100);
  });

  it("should configure default animation duration", () => {
    const params: FocusParams = createFocusParams({}, controllerParams);

    expect(params.animationDuration).toBe(100);
  });

  it("should configure provided animation duration by default", () => {
    const params: FocusParams = createFocusParams(
      { animationDuration: 200 },
      controllerParams,
    );

    expect(params.animationDuration).toBe(200);
  });
});
