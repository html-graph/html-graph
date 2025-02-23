import { standardPriorityFn } from "@/priority";
import { resolvePriority } from "./resolve-priority";

describe("resolvePriority", () => {
  it("should return standard functions by default", () => {
    const fns = resolvePriority(undefined, undefined);

    expect(fns).toStrictEqual({
      nodesPriorityFn: standardPriorityFn,
      edgesPriorityFn: standardPriorityFn,
    });
  });

  it("should return incremental nodes priority function", () => {
    const { nodesPriorityFn } = resolvePriority("incremental", undefined);

    const priorities = [nodesPriorityFn(), nodesPriorityFn()];

    expect(priorities).toStrictEqual([0, 1]);
  });

  it("should return incremental edges priority function", () => {
    const { edgesPriorityFn } = resolvePriority(undefined, "incremental");

    const priorities = [edgesPriorityFn(), edgesPriorityFn()];

    expect(priorities).toStrictEqual([0, 1]);
  });

  it("should return shared incremental nodes and edges priority functions", () => {
    const { nodesPriorityFn, edgesPriorityFn } = resolvePriority(
      "shared-incremental",
      "shared-incremental",
    );

    const priorities = [
      nodesPriorityFn(),
      edgesPriorityFn(),
      nodesPriorityFn(),
      edgesPriorityFn(),
    ];

    expect(priorities).toStrictEqual([0, 1, 2, 3]);
  });

  it("should return constant nodes priority function", () => {
    const { nodesPriorityFn } = resolvePriority(10, undefined);

    const priorities = [nodesPriorityFn(), nodesPriorityFn()];

    expect(priorities).toStrictEqual([10, 10]);
  });

  it("should return constant edges priority function", () => {
    const { edgesPriorityFn } = resolvePriority(undefined, 10);

    const priorities = [edgesPriorityFn(), edgesPriorityFn()];

    expect(priorities).toStrictEqual([10, 10]);
  });

  it("should return specified nodes priority function", () => {
    const fn = (): number => 123;

    const { nodesPriorityFn } = resolvePriority(fn, undefined);

    expect(nodesPriorityFn).toStrictEqual(fn);
  });

  it("should return specified edges priority function", () => {
    const fn = (): number => 123;

    const { edgesPriorityFn } = resolvePriority(undefined, fn);

    expect(edgesPriorityFn).toStrictEqual(fn);
  });
});
