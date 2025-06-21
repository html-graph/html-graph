import { AddEdgeRequest } from "@/canvas";
import { ConnectionPreprocessor } from "./connection-preprocessor";
import { ConnectionTypeResolver } from "./connection-type-resolver";
import { createConfig } from "./create-config";
import { defaultOnAfterEdgeCreated } from "./default-on-after-edge-created";

describe("createOptions", () => {
  it("should return direct connection type resolver by default", () => {
    const options = createConfig({});

    expect(options.connectionTypeResolver("123")).toBe("direct");
  });

  it("should return specified connection type resolver", () => {
    const resolver: ConnectionTypeResolver = () => null;
    const options = createConfig({ connectionTypeResolver: resolver });

    expect(options.connectionTypeResolver).toBe(resolver);
  });

  it("should return default connection preprocessor", () => {
    const options = createConfig({});

    const request: AddEdgeRequest = { from: "1", to: "2" };

    expect(options.connectionPreprocessor(request)).toBe(request);
  });

  it("should return specified connection preprocessor", () => {
    const preprocessor: ConnectionPreprocessor = () => null;
    const options = createConfig({ connectionPreprocessor: preprocessor });

    expect(options.connectionPreprocessor).toBe(preprocessor);
  });

  it("should return LMB mouse down event verifier by default", () => {
    const options = createConfig({});
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
    const options = createConfig({ mouseDownEventVerifier: verifier });

    expect(options.mouseDownEventVerifier).toBe(verifier);
  });

  it("should return LMB mouse up event verifier by default", () => {
    const options = createConfig({});
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
    const options = createConfig({ mouseUpEventVerifier: verifier });

    expect(options.mouseUpEventVerifier).toBe(verifier);
  });

  it("should return default edge created callback", () => {
    const options = createConfig({});

    expect(options.onAfterEdgeCreated).toBe(defaultOnAfterEdgeCreated);
  });

  it("should return specified edge created callback", () => {
    const onEdgeCreated = (): void => {};

    const options = createConfig({
      events: { onAfterEdgeCreated: onEdgeCreated },
    });

    expect(options.onAfterEdgeCreated).toBe(onEdgeCreated);
  });

  it("should return default drag port direction", () => {
    const options = createConfig({});

    expect(options.dragPortDirection).toBe(undefined);
  });

  it("should return specified drag port direction", () => {
    const options = createConfig({ dragPortDirection: Math.PI });

    expect(options.dragPortDirection).toBe(Math.PI);
  });
});
