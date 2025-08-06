import { Queue } from "./queue";

describe("Queue", () => {
  it("should pop null when empty", () => {
    const queue = new Queue<number>();

    expect(queue.pop()).toBe(null);
  });

  it("should pop pushed element", () => {
    const queue = new Queue<number>();

    queue.push(1);

    expect(queue.pop()).toBe(1);
  });

  it("should pop first pushed element", () => {
    const queue = new Queue<number>();

    queue.push(1);
    queue.push(2);

    expect(queue.pop()).toBe(1);
  });

  it("should pop null when poped every element", () => {
    const queue = new Queue<number>();

    queue.push(1);
    queue.push(2);
    queue.pop();
    queue.pop();

    expect(queue.pop()).toBe(null);
  });

  it("should pop manage 3 elements", () => {
    const queue = new Queue<number>();

    queue.push(1);
    queue.push(2);
    queue.push(3);
    queue.pop();
    queue.pop();

    expect(queue.pop()).toBe(3);
  });
});
