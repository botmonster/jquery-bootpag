import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["src/**/*.js"],
    languageOptions: {
      ecmaVersion: 5,
      sourceType: "script",
      globals: {
        ...globals.browser,
        jQuery: "readonly",
        $: "readonly"
      }
    },
    rules: {
      "no-redeclare": "warn",
      "eqeqeq": "off"
    }
  }
];
