import globals from "globals";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["dist/**/*", "playwright-report/**/*", "coverage/**/*"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: { globals: globals.browser },
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
    rules: {
      "@typescript-eslint/explicit-member-accessibility": "error",
      "@typescript-eslint/explicit-function-return-type": "error",
      eqeqeq: "error",
      "lines-between-class-members": "error",
    },
  },
  {
    files: ["use-cases/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../../src/**"],
            },
            {
              group: ["@/**"],
            },
            {
              group: ["@html-graph/html-graph/**", "!@html-graph/html-graph"],
            },
          ],
        },
      ],
    },
  },
);
