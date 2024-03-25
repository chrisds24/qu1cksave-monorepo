module.exports = {
  extends: ["google", "prettier", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  root: true,
  rules: {
    "require-jsdoc": "off",
    "new-cap": "off",
    camelcase: "off",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
