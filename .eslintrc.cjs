module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: [
        "plugin:@typescript-eslint/all",
        "standard",
        "plugin:react/all"
    ],
    overrides: [
        {
            env: {
                node: true
            },
            files: [
                ".eslintrc.{js,cjs}"
            ],
            parserOptions: {
                sourceType: "script"
            }
        }
    ],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json"
    },
    plugins: [
        "react", "@typescript-eslint", "react-hooks"
    ],
    rules: {
        indent: ["error", 4],
        semi: [2, "always"],
        quotes: [2, "double"],
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "error",
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
        "@typescript-eslint/no-type-alias": "off"
    }
};
