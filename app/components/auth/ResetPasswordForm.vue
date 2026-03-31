<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '@nuxt/ui';
import { apiFetch } from '~/composables/useApi';

const emit = defineEmits<{ success: [] }>();
const { t } = useI18n();

const schema = computed(() =>
  z
    .object({
      verification_code: z
        .string()
        .length(6, t('auth.resetPassword.errorCodeInvalid')),
      password: z
        .string()
        .min(8, t('validation.passwordMinLength', { min: 8 })),
      confirm_password: z.string().min(1),
    })
    .refine((data) => data.password === data.confirm_password, {
      message: t('auth.resetPassword.errorPasswordMismatch'),
      path: ['confirm_password'],
    }),
);

const form = reactive({
  verification_code: '',
  password: '',
  confirm_password: '',
});
const isSubmitting = ref(false);
const error = ref<string | null>(null);

async function onSubmit(event: FormSubmitEvent<typeof form>) {
  isSubmitting.value = true;
  error.value = null;
  try {
    await apiFetch('/api/auth/reset-password', {
      method: 'POST',
      body: event.data,
    });
    emit('success');
  } catch {
    error.value = t('auth.resetPassword.errorCodeInvalid');
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <UCard>
    <template #header>
      <h2
        class="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider text-center"
      >
        {{ t('auth.resetPassword.title') }}
      </h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
        {{ t('auth.resetPassword.description') }}
      </p>
    </template>

    <UForm :schema="schema" :state="form" class="space-y-5" @submit="onSubmit">
      <UFormField
        :label="t('auth.resetPassword.codeLabel')"
        name="verification_code"
      >
        <UInput
          v-model="form.verification_code"
          :placeholder="t('auth.resetPassword.codePlaceholder')"
          icon="i-lucide-key"
          class="w-full"
          size="xl"
          maxlength="6"
        />
      </UFormField>

      <UFormField
        :label="t('auth.resetPassword.passwordLabel')"
        name="password"
      >
        <UInput
          v-model="form.password"
          type="password"
          placeholder="••••••••"
          icon="i-lucide-lock"
          class="w-full"
          size="xl"
        />
      </UFormField>

      <UFormField
        :label="t('auth.resetPassword.confirmPasswordLabel')"
        name="confirm_password"
      >
        <UInput
          v-model="form.confirm_password"
          type="password"
          placeholder="••••••••"
          icon="i-lucide-lock-keyhole"
          class="w-full"
          size="xl"
        />
      </UFormField>

      <UAlert v-if="error" color="error" variant="soft" :description="error" />

      <UButton
        type="submit"
        color="primary"
        block
        size="xl"
        :loading="isSubmitting"
        class="font-bold tracking-wide uppercase"
      >
        {{ t('auth.resetPassword.submitButton') }}
      </UButton>
    </UForm>

    <template #footer>
      <div class="text-center">
        <NuxtLink to="/" class="text-sm text-primary-500 hover:underline">
          {{ t('auth.resetPassword.backToLogin') }}
        </NuxtLink>
      </div>
    </template>
  </UCard>
</template>
