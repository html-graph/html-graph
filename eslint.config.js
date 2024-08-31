import globals from "globals";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config({
  files: ["**/*.{js,mjs,cjs,ts}"],
  languageOptions: { globals: globals.browser },
  ignores: ["dist/**/*"],
  extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
});
