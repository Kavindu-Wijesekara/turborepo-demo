import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import turboPlugin from "eslint-plugin-turbo";
import tseslint from "typescript-eslint";
import onlyWarn from "eslint-plugin-only-warn";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unicorn from "eslint-plugin-unicorn";

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
      "simple-import-sort": simpleImportSort,
      unicorn,
      "unused-imports": (await import("eslint-plugin-unused-imports")).default,
    },
    rules: {
      // Auto-remove unused imports on --fix
      "unused-imports/no-unused-imports": "warn",
      "turbo/no-undeclared-env-vars": "warn",
      // Auto-organize imports and exports
      "simple-import-sort/imports": "warn",
      "simple-import-sort/exports": "warn",
      // Enforce kebab-case filenames, ignore Next.js dynamic routes and group folders
      "unicorn/filename-case": [
        "warn",
        {
          case: "kebabCase",
          ignore: [
            // Next.js dynamic routes like [id], [[...slug]]
            "^\\[.*\\]$",
            "^\\(.*\\)$",
            "^\\[\\[\\.\\.\\.\\w+\\]\\]$",
          ],
        },
      ],
    },
  },
  {
    plugins: {
      onlyWarn,
    },
  },
  {
    ignores: ["dist/**"],
  },
];
