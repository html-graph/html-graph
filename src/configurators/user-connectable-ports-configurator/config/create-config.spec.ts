import { AddEdgeRequest, EdgeShapeFactory } from "@/canvas";
import { ConnectionPreprocessor } from "./connection-preprocessor";
import { ConnectionTypeResolver } from "./connection-type-resolver";
import { createConfig } from "./create-config";
import { BezierEdgeShape, DirectEdgeShape } from "@/edges";

describe("createOptions", () => {
  it("should return direct connection type resolver by default", () => {
    const options = createConfig({}, () => new BezierEdgeShape(), 0);

    expect(options.connectionTypeResolver("123")).toBe("direct");
  });

  it("should return specified connection type resolver", () => {
    const resolver: ConnectionTypeResolver = () => null;
    const options = createConfig(
      { connectionTypeResolver: resolver },
      () => new BezierEdgeShape(),
      0,
    );

    expect(options.connectionTypeResolver).toBe(resolver);
  });

  it("should return default connection preprocessor", () => {
    const options = createConfig({}, () => new BezierEdgeShape(), 0);

    const request: AddEdgeRequest = { from: "1", to: "2" };

    expect(options.connectionPreprocessor(request)).toBe(request);
  });

  it("should return specified connection preprocessor", () => {
    const preprocessor: ConnectionPreprocessor = () => null;
    const options = createConfig(
      { connectionPreprocessor: preprocessor },
      () => new BezierEdgeShape(),
      0,
    );

    expect(options.connectionPreprocessor).toBe(preprocessor);
  });

  it("should return LMB mouse down event verifier by default", () => {
    const options = createConfig({}, () => new BezierEdgeShape(), 0);
    const pass = options.mouseDownEventVerifier(
      new MouseEvent("mousedown", { button: 0 }),
    );

    const fail = options.mouseDownEventVerifier(
      new MouseEvent("mousedown", { button: 1 }),
    );

    expect([pass, fail]).toEqual([true, false]);
  });

  it("should return specified mouse down event verifier", () => {
    const verifier: (event: MouseEvent) => boolean = () => false;
    const options = createConfig(
      { mouseDownEventVerifier: verifier },
      () => new BezierEdgeShape(),
      0,
    );

    expect(options.mouseDownEventVerifier).toBe(verifier);
  });

  it("should return LMB mouse up event verifier by default", () => {
    const options = createConfig({}, () => new BezierEdgeShape(), 0);
    const pass = options.mouseDownEventVerifier(
      new MouseEvent("mousedown", { button: 0 }),
    );

    const fail = options.mouseDownEventVerifier(
      new MouseEvent("mousedown", { button: 1 }),
    );

    expect([pass, fail]).toEqual([true, false]);
  });

  it("should return specified mouse up event verifier", () => {
    const verifier: (event: MouseEvent) => boolean = () => false;
    const options = createConfig(
      { mouseUpEventVerifier: verifier },
      () => new BezierEdgeShape(),
      0,
    );

    expect(options.mouseUpEventVerifier).toBe(verifier);
  });

  it("should return default edge created callback", () => {
    const options = createConfig({}, () => new BezierEdgeShape(), 0);

    expect(() => {
      options.onAfterEdgeCreated("123");
    }).not.toThrow();
  });

  it("should return specified edge created callback", () => {
    const onEdgeCreated = (): void => {};

    const options = createConfig(
      {
        events: { onAfterEdgeCreated: onEdgeCreated },
      },
      () => new BezierEdgeShape(),
      0,
    );

    expect(options.onAfterEdgeCreated).toBe(onEdgeCreated);
  });

  it("should return default drag port direction", () => {
    const options = createConfig({}, () => new BezierEdgeShape(), Math.PI);

    expect(options.dragPortDirection).toBe(Math.PI);
  });

  it("should return specified drag port direction", () => {
    const options = createConfig(
      { dragPortDirection: Math.PI },
      () => new BezierEdgeShape(),
      0,
    );

    expect(options.dragPortDirection).toBe(Math.PI);
  });

  it("should return default edge creation interrupted callback", () => {
    const options = createConfig({}, () => new BezierEdgeShape(), 0);

    expect(() => {
      options.onEdgeCreationInterrupted("123", true);
    }).not.toThrow();
  });

  it("should return specified edge creation interrupted callback", () => {
    const onEdgeCreationInterrupted = (): void => {};

    const options = createConfig(
      { events: { onEdgeCreationInterrupted } },
      () => new BezierEdgeShape(),
      0,
    );

    expect(options.onEdgeCreationInterrupted).toBe(onEdgeCreationInterrupted);
  });

  it("should return default edge creation prevented callback", () => {
    const options = createConfig({}, () => new BezierEdgeShape(), 0);

    expect(() => {
      options.onEdgeCreationPrevented({ from: "123", to: "456" });
    }).not.toThrow();
  });

  it("should return specified edge creation interrupted callback", () => {
    const onEdgeCreationPrevented = (): void => {};

    const options = createConfig(
      { events: { onEdgeCreationPrevented } },
      () => new BezierEdgeShape(),
      0,
    );

    expect(options.onEdgeCreationPrevented).toBe(onEdgeCreationPrevented);
  });

  it("should return default edge shape factory", () => {
    const factory: EdgeShapeFactory = () => new BezierEdgeShape();
    const options = createConfig({}, factory, 0);

    expect(options.edgeShapeFactory).toBe(factory);
  });

  it("should return specified edge shape factory", () => {
    const factory: EdgeShapeFactory = () => new BezierEdgeShape();
    const connectionFactory: EdgeShapeFactory = () => new DirectEdgeShape();
    const options = createConfig(
      { edgeShapeFactory: connectionFactory },
      factory,
      0,
    );

    expect(options.edgeShapeFactory).toBe(connectionFactory);
  });
});
