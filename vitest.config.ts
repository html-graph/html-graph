import { defineConfig } from "vitest/config";
import { resolveOptions } from "./configs/resolve-options";

export default defineConfig({
  resolve: resolveOptions,
  test: {
    include: ["./src/**/*.spec.ts"],
    environment: "jsdom",
    setupFiles: "./unit-setup.ts",
    coverage: {
      thresholds: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100,
      },
      exclude: ["src/**/*.mock.ts", "src/**/index.ts"],
    },
  },
});
