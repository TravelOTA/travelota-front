/**
 * Archivo de setup global para Vitest.
 * Se ejecuta antes de cada archivo de test.
 */
import { config } from "@vue/test-utils";

// Suprime warnings de Vue en tests
config.global.config.warnHandler = () => {};
