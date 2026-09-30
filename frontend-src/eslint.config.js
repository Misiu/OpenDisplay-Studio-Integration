import js from "@eslint/js";
import lit from "eslint-plugin-lit";
import litA11y from "eslint-plugin-lit-a11y";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["node_modules", "playwright-report", "test-results"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  lit.configs["flat/recommended"],
  litA11y.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser },
    },
    rules: {
      // Type safety is a rule of this repository (see CLAUDE.md).
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/ban-ts-comment": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      // Readable code: no dense expressions, no leftovers.
      "no-console": "error",
      "no-nested-ternary": "error",
      "no-unused-expressions": "error",
      curly: ["error", "multi-line"],
      eqeqeq: ["error", "always"],
      "max-len": [
        "error",
        {
          code: 100,
          comments: 100,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreRegExpLiterals: true,
        },
      ],
      // Home Assistant dialogs focus their first field with `autofocus`.
      "lit-a11y/no-autofocus": "off",
    },
  }
);
