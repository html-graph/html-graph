import { TwoWayMap } from "./two-way-map";

describe("TwoWayMap", () => {
  it("should return undefined value for non-existing key", () => {
    const map = new TwoWayMap<number, string>();

    expect(map.getByKey(1)).toBe(undefined);
  });

  it("should return specified value by key", () => {
    const map = new TwoWayMap<number, string>();
    map.set(1, "2");

    expect(map.getByKey(1)).toBe("2");
  });

  it("should return true for existing value", () => {
    const map = new TwoWayMap<number, string>();
    map.set(1, "2");

    expect(map.hasKey(1)).toBe(true);
  });

  it("should return true for existing key", () => {
    const map = new TwoWayMap<number, string>();
    map.set(1, "2");

    expect(map.hasValue("2")).toBe(true);
  });

  it("should return specified key by value", () => {
    const map = new TwoWayMap<number, string>();
    map.set(1, "2");

    expect(map.getByValue("2")).toBe(1);
  });

  it("should delete key by key", () => {
    const map = new TwoWayMap<number, string>();
    map.set(1, "2");
    map.deleteByKey(1);

    expect(map.getByKey(1)).toBe(undefined);
  });

  it("should delete key by value", () => {
    const map = new TwoWayMap<number, string>();
    map.set(1, "2");
    map.deleteByValue("2");

    expect(map.getByKey(1)).toBe(undefined);
  });

  it("should delete value by key", () => {
    const map = new TwoWayMap<number, string>();
    map.set(1, "2");
    map.deleteByKey(1);

    expect(map.getByValue("2")).toBe(undefined);
  });

  it("should delete value by value", () => {
    const map = new TwoWayMap<number, string>();
    map.set(1, "2");
    map.deleteByValue("2");

    expect(map.getByValue("2")).toBe(undefined);
  });

  it("should clear keys", () => {
    const map = new TwoWayMap<number, string>();
    map.set(1, "2");
    map.clear();

    expect(map.getByKey(1)).toBe(undefined);
  });

  it("should clear values", () => {
    const map = new TwoWayMap<number, string>();
    map.set(1, "2");
    map.clear();

    expect(map.getByValue("2")).toBe(undefined);
  });

  it("should iterate through values", () => {
    const map = new TwoWayMap<number, string>();
    map.set(1, "2");

    const callback: (value: string, key: number) => void = () => {
      // thsi mock callback is intended to be empty
    };

    const spy = jest.fn(callback);

    map.forEach(spy);

    expect(spy).toHaveBeenCalledWith("2", 1);
  });
});
