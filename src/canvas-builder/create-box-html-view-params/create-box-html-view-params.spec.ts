import { createBoxHtmlViewParams } from "./create-box-html-view-params";

describe("createBoxHtmlViewParams", () => {
  it("should resolve default onBeforeNodeAttached handler", () => {
    const params = createBoxHtmlViewParams(undefined);

    expect(params.onBeforeNodeAttached).not.toThrow();
  });

  it("should resolve specified onBeforeNodeAttached handler", () => {
    const onBeforeNodeAttached = (): void => {};

    const params = createBoxHtmlViewParams({
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
    const params = createBoxHtmlViewParams(undefined);

    expect(params.onAfterNodeDetached).not.toThrow();
  });

  it("should resolve specified onAfterNodeDetached handler", () => {
    const onAfterNodeDetached = (): void => {};

    const params = createBoxHtmlViewParams({
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
