import globals from "globals";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["dist/**/*"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: { globals: globals.browser },
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
  },
  {
    files: ["examples/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../../lib/**", "!../../lib"],
            },
            {
              group: ["@html-graph/html-graph/**", "!@html-graph/html-graph"],
            },
            {
              group: ["@/**"],
            },
          ],
        },
      ],
    },
  },
);
