import type { Config } from "jest";
import parentConfig from "./jest.config";

const config: Config = {
  ...parentConfig,
  collectCoverage: true,
  coverageReporters: ["json-summary", "text", "text-summary"],
};

export default config;
