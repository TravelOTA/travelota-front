<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import { apiFetch } from "~/composables/useApi";

const emit = defineEmits<{ success: [] }>();
const { t } = useI18n();

const schema = computed(() =>
  z.object({
    email: z.string().email(t("validation.emailInvalid")),
  }),
);

const form = reactive({ email: "" });
const isSubmitting = ref(false);
const error = ref<string | null>(null);

async function onSubmit(event: FormSubmitEvent<{ email: string }>) {
  isSubmitting.value = true;
  error.value = null;
  try {
    await apiFetch("/api/auth/forgot-password", {
      method: "POST",
      body: { email: event.data.email },
    });
    emit("success");
  } catch {
    // API always returns 200 to prevent email enumeration — only fail on network errors
    error.value = t("auth.forgotPassword.errorGeneric");
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <UCard>
    <template #header>
      <h2 class="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider text-center">
        {{ t('auth.forgotPassword.title') }}
      </h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
        {{ t('auth.forgotPassword.description') }}
      </p>
    </template>

    <UForm :schema="schema" :state="form" class="space-y-5" @submit="onSubmit">
      <UFormField :label="t('auth.forgotPassword.emailLabel')" name="email">
        <UInput
          v-model="form.email"
          type="email"
          :placeholder="t('auth.forgotPassword.emailPlaceholder')"
          icon="i-lucide-mail"
          class="w-full"
          size="xl"
        />
      </UFormField>

      <UAlert
        v-if="error"
        color="error"
        variant="soft"
        :description="error"
      />

      <UButton
        type="submit"
        color="primary"
        block
        size="xl"
        :loading="isSubmitting"
        class="font-bold tracking-wide uppercase"
      >
        {{ t('auth.forgotPassword.submitButton') }}
      </UButton>
    </UForm>

    <template #footer>
      <div class="text-center">
        <NuxtLink to="/" class="text-sm text-primary-500 hover:underline">
          {{ t('auth.forgotPassword.backToLogin') }}
        </NuxtLink>
      </div>
    </template>
  </UCard>
</template>
