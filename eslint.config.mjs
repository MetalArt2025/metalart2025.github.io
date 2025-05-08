import css from "@eslint/css";
import html from "eslint-plugin-html";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.html"],
    plugins: { html },
  },
  // {
  //   files: ["**/*.{js,mjs,cjs}"],
  //   plugins: { js },
  //   extends: ["js/recommended"],
  // },
  // {
  //   files: ["**/*.json"],
  //   plugins: { json },
  //   language: "json/json",
  //   extends: ["json/recommended"],
  // },
  {
    files: ["**/*.css"],
    plugins: { css },
    language: "css/css",
    extends: ["css/recommended"],
  },
  {
    ignores: ["ìncludes/*.js"],
  },
  {
    files: ["js/*.js"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "script", // not 'module' since this is for classic script tags
      globals: {
        console: "readonly",
        window: "readonly",
        document: "readonly",
        $: "readonly", // jQuery global
        jQuery: "readonly",
        THREE: "readonly",

        // Custom globals (ughshhhhh)
        // ringsObject: "readonly",
        // pricesObj: "writable",
        // goldPrice: "writable",
        // userRings: "writable",
        // shopSiteURL: "readonly",
        // ringSiteURL: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",
      "no-console": "off",
    },
  },
]);
