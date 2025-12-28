import { TreeMapNode } from "./tree-map-node";

describe("TreeMapNode", () => {
  it("should set node payload", () => {
    const payload = {};
    const node = new TreeMapNode<string, object>(payload);

    expect(node.payload).toBe(payload);
  });

  it("should create node with 0 children", () => {
    const payload = {};
    const node = new TreeMapNode<string, object>(payload);

    expect(node.payload).toBe(payload);
  });

  it("should create node with null parent", () => {
    const node = new TreeMapNode<string, object>({});

    expect(node.getParent()).toBe(null);
  });

  it("should set parent's child", () => {
    const parent = new TreeMapNode<string, object>({});
    const child = new TreeMapNode<string, object>({});
    parent.setChild("child", child);

    expect(parent.getChildren()).toEqual(new Map([["child", child]]));
  });

  it("should unset parent's child", () => {
    const parent = new TreeMapNode<string, object>({});
    const child = new TreeMapNode<string, object>({});
    parent.setChild("child", child);
    parent.unsetChild("child");

    expect(parent.getChildren()).toEqual(new Map());
  });

  it("should set child's parent", () => {
    const parent = new TreeMapNode<string, object>({});
    const child = new TreeMapNode<string, object>({});
    child.setParent("child", parent);

    expect(child.getParent()).toBe(parent);
  });

  it("should unset child's parent", () => {
    const parent = new TreeMapNode<string, object>({});
    const child = new TreeMapNode<string, object>({});
    child.setParent("child", parent);
    child.unsetParent();

    expect(child.getParent()).toBe(null);
  });

  it("should set parents's child when setting childs's parent", () => {
    const parent = new TreeMapNode<string, object>({});
    const child = new TreeMapNode<string, object>({});

    child.setParent("child", parent);

    expect(parent.getChildren()).toEqual(new Map([["child", child]]));
  });

  it("should set child's parent when setting parents's child", () => {
    const parent = new TreeMapNode<string, object>({});
    const child = new TreeMapNode<string, object>({});

    parent.setChild("child", child);

    expect(child.getParent()).toEqual(parent);
  });
});
