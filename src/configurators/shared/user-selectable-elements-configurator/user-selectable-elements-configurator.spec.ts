import { createElement, createMouseMoveEvent } from "@/mocks";
import { PointInsideVerifier } from "../point-inside-verifier";
import { UserSelectableElementsConfigurator } from "./user-selectable-elements-configurator";

const createConfigurator = (options?: {
  onSelected?: (element: Element) => void;
  mouseDownEventVerifier?: (event: MouseEvent) => boolean;
  mouseUpEventVerifier?: (event: MouseEvent) => boolean;
  movementThreshold?: number;
}): UserSelectableElementsConfigurator => {
  const element = createElement({ width: 1000, height: 1000 });
  const pointInsideVerifier = new PointInsideVerifier(element, window);

  const configurator = new UserSelectableElementsConfigurator(
    window,
    pointInsideVerifier,
    {
      onSelected: options?.onSelected ?? ((): void => {}),
      mouseDownEventVerifier:
        options?.mouseDownEventVerifier ?? ((): boolean => true),
      mouseUpEventVerifier:
        options?.mouseUpEventVerifier ?? ((): boolean => true),
      movementThreshold: options?.movementThreshold ?? 10,
    },
  );

  return configurator;
};

describe("UserSelectableEntitesConfigurator", () => {
  it("should call specified callback for element with enabled selection", () => {
    const onSelected = jest.fn();
    const configurator = createConfigurator({ onSelected });

    const selectableElement = document.createElement("div");

    configurator.enable(selectableElement);

    selectableElement.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 200,
        clientY: 200,
      }),
    );

    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(onSelected).toHaveBeenCalledWith(selectableElement);
  });

  it("should call specified callback for element with disabled selection", () => {
    const onSelected = jest.fn();
    const configurator = createConfigurator({ onSelected });

    const selectableElement = document.createElement("div");

    configurator.enable(selectableElement);
    configurator.disable(selectableElement);

    selectableElement.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 200,
        clientY: 200,
      }),
    );

    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(onSelected).not.toHaveBeenCalled();
  });

  it("should prevent selection initiation process when mouse down verifier not passed", () => {
    const onSelected = jest.fn();
    const configurator = createConfigurator({
      onSelected,
      mouseDownEventVerifier: (event: MouseEvent) => event.ctrlKey,
    });

    const selectableElement = document.createElement("div");

    configurator.enable(selectableElement);

    selectableElement.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 200,
        clientY: 200,
      }),
    );

    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(onSelected).not.toHaveBeenCalled();
  });

  it("should prevent selection when mouse up verifier not passed", () => {
    const onSelected = jest.fn();
    const configurator = createConfigurator({
      onSelected,
      mouseUpEventVerifier: (event: MouseEvent) => event.ctrlKey,
    });

    const selectableElement = document.createElement("div");

    configurator.enable(selectableElement);

    selectableElement.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 200,
        clientY: 200,
      }),
    );

    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(onSelected).not.toHaveBeenCalled();
  });

  it("should emit selection once", () => {
    const onSelected = jest.fn();
    const configurator = createConfigurator({ onSelected });

    const selectableElement = document.createElement("div");

    configurator.enable(selectableElement);

    selectableElement.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 200,
        clientY: 200,
      }),
    );

    window.dispatchEvent(new MouseEvent("mouseup"));
    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(onSelected).toHaveBeenCalledTimes(1);
  });

  it("should cancel selection when mouse move distance is more than specified threshold", () => {
    const onSelected = jest.fn();
    const configurator = createConfigurator({ onSelected });

    const selectableElement = document.createElement("div");

    configurator.enable(selectableElement);

    selectableElement.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 200,
        clientY: 200,
      }),
    );

    window.dispatchEvent(createMouseMoveEvent({ clientX: 300, clientY: 300 }));
    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(onSelected).not.toHaveBeenCalled();
  });

  it("should stack cursor movement when calculating threshold", () => {
    const onSelected = jest.fn();
    const configurator = createConfigurator({ onSelected });

    const selectableElement = document.createElement("div");

    configurator.enable(selectableElement);

    selectableElement.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 200,
        clientY: 200,
      }),
    );

    window.dispatchEvent(createMouseMoveEvent({ clientX: 205, clientY: 200 }));
    window.dispatchEvent(createMouseMoveEvent({ clientX: 211, clientY: 200 }));
    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(onSelected).not.toHaveBeenCalled();
  });

  it("should reset cursor travel", () => {
    const onSelected = jest.fn();
    const configurator = createConfigurator({ onSelected });

    const selectableElement = document.createElement("div");

    configurator.enable(selectableElement);

    selectableElement.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 200,
        clientY: 200,
      }),
    );

    window.dispatchEvent(createMouseMoveEvent({ clientX: 211, clientY: 200 }));
    window.dispatchEvent(new MouseEvent("mouseup"));

    selectableElement.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 200,
        clientY: 200,
      }),
    );
    window.dispatchEvent(createMouseMoveEvent({ clientX: 205, clientY: 200 }));
    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(onSelected).toHaveBeenCalled();
  });

  it("should remove mouse movement listener on selection finish", () => {
    const onSelected = jest.fn();
    const configurator = createConfigurator({ onSelected });

    const selectableElement = document.createElement("div");

    configurator.enable(selectableElement);

    selectableElement.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 200,
        clientY: 200,
      }),
    );

    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(onSelected).toHaveBeenCalledWith(selectableElement);

    const spy = jest.spyOn(window, "removeEventListener");

    selectableElement.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 1,
        clientY: 1,
      }),
    );
    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(spy).toHaveBeenCalledWith("mousemove", expect.anything());
    spy.mockClear();
  });

  it("should cancel selection when mouse cursor moved outside", () => {
    const onSelected = jest.fn();
    const configurator = createConfigurator({ onSelected });

    const selectableElement = document.createElement("div");

    configurator.enable(selectableElement);

    selectableElement.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 1,
        clientY: 1,
      }),
    );

    window.dispatchEvent(createMouseMoveEvent({ clientX: -1, clientY: -1 }));
    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(onSelected).not.toHaveBeenCalled();
  });

  it("should not call specified callback when selection was disabled in the process", () => {
    const onSelected = jest.fn();
    const configurator = createConfigurator({ onSelected });

    const selectableElement = document.createElement("div");

    configurator.enable(selectableElement);

    selectableElement.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 1,
        clientY: 1,
      }),
    );

    window.dispatchEvent(createMouseMoveEvent({ clientX: 2, clientY: 2 }));

    configurator.disable(selectableElement);

    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(onSelected).not.toHaveBeenCalled();
  });

  it("should call specified callback when selection was disabled on another element", () => {
    const onSelected = jest.fn();
    const configurator = createConfigurator({ onSelected });

    const selectableElement1 = document.createElement("div");
    const selectableElement2 = document.createElement("div");

    configurator.enable(selectableElement1);
    configurator.enable(selectableElement2);

    selectableElement1.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: 1,
        clientY: 1,
      }),
    );

    window.dispatchEvent(createMouseMoveEvent({ clientX: 2, clientY: 2 }));

    configurator.disable(selectableElement2);

    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(onSelected).toHaveBeenCalledWith(selectableElement1);
  });
});
