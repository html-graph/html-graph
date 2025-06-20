import { PortsCollection } from "./ports-collection";

describe("PortsCollection", () => {
  it("should add port to collection", () => {
    const element = document.createElement("div");

    const collection = new PortsCollection();

    collection.addPort(element, "port-1");

    const portId = collection.getFirstPortId(element);

    expect(portId).toBe("port-1");
  });

  it("should remove port", () => {
    const element = document.createElement("div");

    const collection = new PortsCollection();

    collection.addPort(element, "port-1");
    collection.deletePort(element);

    const portId = collection.getFirstPortId(element);

    expect(portId).toBe(undefined);
  });

  it("should clear ports", () => {
    const element = document.createElement("div");

    const collection = new PortsCollection();

    collection.addPort(element, "port-1");
    collection.clear();

    const portId = collection.getFirstPortId(element);

    expect(portId).toBe(undefined);
  });
});
