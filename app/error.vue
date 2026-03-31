<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps<{ error: NuxtError }>();
const { t } = useI18n();

const is404 = computed(() => props.error.statusCode === 404);
const is500 = computed(() => (props.error.statusCode ?? 500) >= 500);

const title = computed(() => {
  if (is404.value) return t("errors.notFound.title");
  if (is500.value) return t("errors.serverErrorPage.title");
  return t("errors.generic.title");
});

const description = computed(() => {
  if (is404.value) return t("errors.notFound.description");
  if (is500.value) return t("errors.serverErrorPage.description");
  return t("errors.generic.description");
});

const icon = computed(() => {
  if (is404.value) return "i-heroicons-map-pin";
  if (is500.value) return "i-heroicons-server";
  return "i-heroicons-exclamation-triangle";
});

function handleRetry() {
  clearError({ redirect: undefined });
}
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4"
  >
    <div class="max-w-md w-full text-center">
      <div
        class="mx-auto mb-6 w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
      >
        <UIcon :name="icon" class="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>

      <p class="text-sm font-mono text-gray-400 dark:text-gray-500 mb-2">
        {{ error.statusCode }}
      </p>

      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        {{ title }}
      </h1>

      <p class="text-gray-500 dark:text-gray-400 mb-8">
        {{ description }}
      </p>

      <div class="flex items-center justify-center gap-3">
        <UButton
          v-if="is500"
          color="primary"
          icon="i-heroicons-arrow-path"
          @click="handleRetry"
        >
          {{ t("errors.retry") }}
        </UButton>
        <UButton
          :color="is500 ? 'neutral' : 'primary'"
          :variant="is500 ? 'ghost' : 'solid'"
          icon="i-heroicons-home"
          to="/"
        >
          {{ t("errors.backHome") }}
        </UButton>
      </div>
    </div>
  </div>
</template>
