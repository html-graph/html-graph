import { OneToManyCollection } from "./one-to-many-collection";

describe("OneToManyCollection", () => {
  it("should retrieve added entry by single value", () => {
    const collection = new OneToManyCollection<string, string>();

    collection.addRecord("single-1", "multi-1");

    const multi = collection.getFirstBySingle("single-1");

    expect(multi).toBe("multi-1");
  });

  it("should store multiple entries for one single value", () => {
    const collection = new OneToManyCollection<string, string>();

    collection.addRecord("single-1", "multi-1");
    collection.addRecord("single-1", "multi-2");

    const multi = collection.getFirstBySingle("single-1");

    expect(multi).toBe("multi-1");
  });

  it("should remove entry by multi value", () => {
    const collection = new OneToManyCollection<string, string>();

    collection.addRecord("single-1", "multi-1");
    collection.removeByMulti("multi-1");

    const multi = collection.getFirstBySingle("single-1");

    expect(multi).toBe(undefined);
  });

  it("should retrieve added entry by multi value", () => {
    const collection = new OneToManyCollection<string, string>();

    collection.addRecord("single-1", "multi-1");

    const multi = collection.getByMulti("multi-1");

    expect(multi).toBe("single-1");
  });

  it("should not retrieve entry removed by multi value", () => {
    const collection = new OneToManyCollection<string, string>();

    collection.addRecord("single-1", "multi-1");
    collection.removeByMulti("multi-1");

    const multi = collection.getByMulti("multi-1");

    expect(multi).toBe(undefined);
  });

  it("should remove entry by single value", () => {
    const collection = new OneToManyCollection<string, string>();

    collection.addRecord("single-1", "multi-1");
    collection.removeBySingle("single-1");

    const multi = collection.getFirstBySingle("single-1");

    expect(multi).toBe(undefined);
  });

  it("should not retrieve entry removed by single value", () => {
    const collection = new OneToManyCollection<string, string>();

    collection.addRecord("single-1", "multi-1");
    collection.removeBySingle("single-1");

    const multi = collection.getByMulti("multi-1");

    expect(multi).toBe(undefined);
  });

  it("should return second multi value after deletion", () => {
    const collection = new OneToManyCollection<string, string>();

    collection.addRecord("single-1", "multi-1");
    collection.addRecord("single-1", "multi-2");
    collection.removeByMulti("multi-1");
    const multi = collection.getFirstBySingle("single-1");

    expect(multi).toBe("multi-2");
  });

  it("should not retreive by single value after clear", () => {
    const collection = new OneToManyCollection<string, string>();

    collection.addRecord("single-1", "multi-1");
    collection.clear();
    const multi = collection.getFirstBySingle("single-1");

    expect(multi).toBe(undefined);
  });

  it("should not retreive by mutli value after clear", () => {
    const collection = new OneToManyCollection<string, string>();

    collection.addRecord("single-1", "multi-1");
    collection.clear();
    const multi = collection.getByMulti("multi-1");

    expect(multi).toBe(undefined);
  });
});
