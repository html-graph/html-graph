import { IdGenerator } from "./id-generator";

describe("IdGenerator", () => {
  it("should return suggested id if provided", () => {
    const gen = new IdGenerator(() => false);

    expect(gen.create(10)).toBe(10);
  });

  it("should return 0 when no values exist", () => {
    const gen = new IdGenerator(() => false);

    expect(gen.create(undefined)).toBe(0);
  });

  it("should call check once when no values exist", () => {
    const checkFn = jest.fn((): boolean => false);

    const gen = new IdGenerator(checkFn);

    gen.create(undefined);

    expect(checkFn).toHaveBeenCalledTimes(1);
  });

  it("should return 1 when has [0] values", () => {
    const gen = new IdGenerator((id) => id === 0);

    expect(gen.create(undefined)).toBe(1);
  });

  it("should call check twice when has [0] value", () => {
    const checkFn = jest.fn((id): boolean => id === 0);

    const gen = new IdGenerator(checkFn);

    gen.create(undefined);

    expect(checkFn).toHaveBeenCalledTimes(2);
  });

  it("should call check 3 times when called create two times", () => {
    const checkFn = jest.fn((id): boolean => id === 0);

    const gen = new IdGenerator(checkFn);

    gen.create(undefined);
    gen.create(undefined);

    expect(checkFn).toHaveBeenCalledTimes(3);
  });

  it("should call check 4 times when called reset before create", () => {
    const checkFn = jest.fn((id): boolean => id === 0);

    const gen = new IdGenerator(checkFn);

    gen.create(undefined);
    gen.reset();
    gen.create(undefined);

    expect(checkFn).toHaveBeenCalledTimes(4);
  });
});
