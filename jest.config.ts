import type { Config } from "jest";
import { pathsToModuleNameMapper } from "ts-jest";
// In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// which contains the path mapping (ie the `compilerOptions.paths` option):
import { compilerOptions } from "./tsconfig.json";

const config: Config = {
  preset: "ts-jest",
  roots: ["lib"],
  testEnvironment: "jsdom",
  setupFiles: ["./setup-jest.ts"],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/lib/.*\\.mock\\.ts$",
    "/index\\.ts$",
  ],
  collectCoverageFrom: ["./lib/**/*.ts"],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  coverageReporters: ["lcov", "text", "text-summary"],
};

export default config;
