import { resolve } from "path";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.{test,spec}.ts"],
    exclude: ["**/node_modules/**", "tests/e2e/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["app/composables/**/*.ts", "app/utils/**/*.ts"],
      exclude: ["**/*.test.ts", "**/*.spec.ts"],
    },
    clearMocks: true,
    restoreMocks: true,
  },
  resolve: {
    alias: {
      "~": resolve(__dirname, "app"),
      "@": resolve(__dirname, "app"),
      "#imports": resolve(__dirname, "tests/__mocks__/imports.ts"),
      "#app": resolve(__dirname, "tests/__mocks__/app.ts"),
      "#shared": resolve(__dirname, "shared"),
    },
  },
});
