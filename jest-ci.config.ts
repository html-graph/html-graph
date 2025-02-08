import type { Config } from "jest";
import parentConfig from "./jest.config";

const config: Config = {
  ...parentConfig,
  collectCoverage: true,
  coverageReporters: ["text", "text-summary", "json"],
};

export default config;
