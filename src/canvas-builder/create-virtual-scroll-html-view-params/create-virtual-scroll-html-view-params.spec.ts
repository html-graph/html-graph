import { createVirtualScrollHtmlViewParams } from "./create-virtual-scroll-html-view-params";

describe("createVirtualScrollHtmlViewParams", () => {
  it("should resolve default onBeforeNodeAttached handler", () => {
    const params = createVirtualScrollHtmlViewParams(undefined);

    expect(params.onBeforeNodeAttached).not.toThrow();
  });

  it("should resolve specified onBeforeNodeAttached handler", () => {
    const onBeforeNodeAttached = (): void => {};

    const params = createVirtualScrollHtmlViewParams({
      nodeContainingRadius: {
        vertical: 50,
        horizontal: 50,
      },
      events: {
        onBeforeNodeAttached,
      },
    });

    expect(params.onBeforeNodeAttached).toBe(onBeforeNodeAttached);
  });

  it("should resolve default onAfterNodeDetached handler", () => {
    const params = createVirtualScrollHtmlViewParams(undefined);

    expect(params.onAfterNodeDetached).not.toThrow();
  });

  it("should resolve specified onAfterNodeDetached handler", () => {
    const onAfterNodeDetached = (): void => {};

    const params = createVirtualScrollHtmlViewParams({
      nodeContainingRadius: {
        vertical: 50,
        horizontal: 50,
      },
      events: {
        onAfterNodeDetached,
      },
    });

    expect(params.onAfterNodeDetached).toBe(onAfterNodeDetached);
  });
});
