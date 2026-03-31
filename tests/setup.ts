/**
 * Archivo de setup global para Vitest.
 * Se ejecuta antes de cada archivo de test.
 */
import { config } from "@vue/test-utils";
import { vi } from "vitest";

// Suprime warnings de Vue en tests
config.global.config.warnHandler = () => {};

// Mock global de useI18n para componentes que lo usan (Nuxt auto-import)
vi.stubGlobal("useI18n", () => ({
  t: (key: string) => key,
  locale: { value: "es" },
}));
