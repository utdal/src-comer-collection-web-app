module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: [
        "standard",
        "plugin:react/all",
        "plugin:@typescript-eslint/recommended"
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
        sourceType: "module"
    },
    plugins: [
        "react", "react-hooks", "@typescript-eslint"
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
        "react/require-default-props": [0]
    }
};
