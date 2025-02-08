import type { Config } from "jest";
import { pathsToModuleNameMapper } from "ts-jest";
// In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// which contains the path mapping (ie the `compilerOptions.paths` option):
import { compilerOptions } from "./tsconfig.json";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFiles: ["./setup-jest.ts"],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/lib/.*\\.mock\\.ts$",
    "/lib/index\\.ts$",
  ],
  // collectCoverageFrom: ["./lib/**/*.ts"],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
    // TODO: remove
    "./lib/canvas/user-transformable-canvas/options": {
      branches: 100,
      functions: 60,
      lines: 100,
      statements: 100,
    },
    // TODO: remove
    "./lib/canvas/user-transformable-canvas": {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
};

export default config;
