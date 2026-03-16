// eslint.config.mjs
import withNuxt from "./.nuxt/eslint.config.mjs";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default withNuxt(eslintPluginPrettierRecommended, {
  rules: {
    "prettier/prettier": [
      "error",
      {
        singleQuotes: true,
        semi: true,
        endOfLine: "auto",
      },
    ],
    "vue/no-multiple-template-root": "off",
  },
});
