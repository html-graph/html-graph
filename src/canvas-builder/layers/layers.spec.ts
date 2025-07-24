import { Layers } from "./layers";

describe("Layers", () => {
  it("should create layers", () => {
    const element = document.createElement("div");
    new Layers(element);

    expect(element.children.length).toBe(1);
  });

  it("should create main layer", () => {
    const element = document.createElement("div");
    const layers = new Layers(element);

    expect(layers.main.parentElement!.parentElement).toBe(element);
  });

  it("should create background layer", () => {
    const element = document.createElement("div");
    const layers = new Layers(element);

    expect(layers.background.parentElement!.parentElement).toBe(element);
  });

  it("should create connectable ports overlay layer", () => {
    const element = document.createElement("div");
    const layers = new Layers(element);

    expect(layers.overlayConnectablePorts.parentElement!.parentElement).toBe(
      element,
    );
  });

  it("should destroy layers", () => {
    const element = document.createElement("div");
    const layers = new Layers(element);

    layers.destroy();

    expect(element.children.length).toBe(0);
  });
});
