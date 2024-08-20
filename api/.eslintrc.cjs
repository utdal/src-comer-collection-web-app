module.exports = {
    env: {
        es2021: true,
        node: true
    },
    extends: [
        "standard",
        "plugin:react/recommended"
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
        "react"
    ],
    rules: {
        indent: ["error", 4],
        semi: [2, "always"],
        quotes: [2, "double"]
    }
};
