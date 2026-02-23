import { immediateScheduleFn, microtaskScheduleFn } from "@/schedule-fn";
import { createLayoutParams } from "../create-layout-params";
import { createViewportControllerParams } from "./create-viewport-controller-params";
import { EventSubject } from "@/event-subject";

describe("createViewportControllerParams", () => {
  it("should configure default focus content offset", () => {
    const viewportControllerParams = createViewportControllerParams({
      canvasDefaults: {},
      hasLayout: false,
      layoutParams: createLayoutParams({}),
    });

    expect(viewportControllerParams.focus.contentOffset).toBe(100);
  });

  it("should configure specified focus content offset", () => {
    const viewportControllerParams = createViewportControllerParams({
      canvasDefaults: {
        focus: {
          contentOffset: 200,
        },
      },
      hasLayout: false,
      layoutParams: createLayoutParams({}),
    });

    expect(viewportControllerParams.focus.contentOffset).toBe(200);
  });

  it("should configure default minimum content scale", () => {
    const viewportControllerParams = createViewportControllerParams({
      canvasDefaults: {},
      hasLayout: false,
      layoutParams: createLayoutParams({}),
    });

    expect(viewportControllerParams.focus.minContentScale).toBe(0);
  });

  it("should configure specified minimum content scale", () => {
    const viewportControllerParams = createViewportControllerParams({
      canvasDefaults: {
        focus: {
          minContentScale: 0.25,
        },
      },
      hasLayout: false,
      layoutParams: createLayoutParams({}),
    });

    expect(viewportControllerParams.focus.minContentScale).toBe(0.25);
  });

  it("should configure immediate schedule function when layout is not configured", () => {
    const viewportControllerParams = createViewportControllerParams({
      canvasDefaults: {
        focus: {
          minContentScale: 0.25,
        },
      },
      hasLayout: false,
      layoutParams: createLayoutParams({}),
    });

    expect(viewportControllerParams.focus.schedule).toBe(immediateScheduleFn);
  });

  it("should configure microtask schedule function when layout microtask application strategy configured", () => {
    const viewportControllerParams = createViewportControllerParams({
      canvasDefaults: {
        focus: {
          minContentScale: 0.25,
        },
      },
      hasLayout: true,
      layoutParams: createLayoutParams({
        applyOn: { type: "topologyChangeMicrotask" },
      }),
    });

    expect(viewportControllerParams.focus.schedule).toBe(microtaskScheduleFn);
  });

  it("should configure immediate schedule function when layout trigger application strategy configured", () => {
    const viewportControllerParams = createViewportControllerParams({
      canvasDefaults: {
        focus: {
          minContentScale: 0.25,
        },
      },
      hasLayout: true,
      layoutParams: createLayoutParams({
        applyOn: new EventSubject(),
      }),
    });

    expect(viewportControllerParams.focus.schedule).toBe(immediateScheduleFn);
  });
});
