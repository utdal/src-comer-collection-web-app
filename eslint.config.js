import globals from "globals";
import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import tseslint from "typescript-eslint";

export default tseslint.config(
    {
        files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]
    },
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node
            }
        }
    },
    js.configs.all,
    pluginReact.configs.flat.all,
    ...tseslint.configs.all,
    {
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                projectService: true,
                project: "./tsconfig.json"
            }
        },
        rules: {
            indent: ["error", 4],
            semi: [2, "always"],
            quotes: [2, "double"],
            "no-multiple-empty-lines": [2, { max: 1 }],
            "sort-imports": ["off"],
            "sort-keys": ["off"],
            "max-lines-per-function": ["off"],
            "max-statements": "off",
            "id-length": "off",
            "one-var": ["error", "never"],
            "no-duplicate-imports": "off",
            "max-lines": "off",
            "no-ternary": "off",
            "capitalized-comments": "off",
            "no-console": "warn",
            // "react-hooks/rules-of-hooks": "error",
            // "react-hooks/exhaustive-deps": "error",
            "react/function-component-definition": [2, {
                namedComponents: "arrow-function"
            }],
            "react/jsx-filename-extension": [1, {
                extensions: [".js", ".jsx", ".tsx"]
            }],
            "react/jsx-no-bind": [0],
            "react/jsx-max-depth": [0],
            "react/jsx-no-literals": [0],
            "react/require-default-props": [0],
            "@typescript-eslint/object-curly-spacing": "off",
            "@typescript-eslint/naming-convention": "off",
            "@typescript-eslint/no-type-alias": "off",
            "@typescript-eslint/no-magic-numbers": "off",
            "@typescript-eslint/no-extra-parens": "off",
            "@typescript-eslint/indent": "off",
            "@typescript-eslint/prefer-readonly-parameter-types": "off"
        }
    }
);