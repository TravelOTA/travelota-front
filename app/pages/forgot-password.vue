<script setup lang="ts">
const { t } = useI18n();
useSeoMeta({ title: t("auth.forgotPassword.title") });

const showSuccess = ref(false);
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-16">
    <div class="w-full max-w-md">
      <AuthForgotPasswordForm
        v-if="!showSuccess"
        @success="showSuccess = true"
      />

      <UCard v-else class="text-center">
        <template #header>
          <div class="flex items-center justify-center gap-2">
            <UIcon name="i-lucide-mail-check" class="w-5 h-5 text-success-500" />
            <h3 class="font-semibold text-gray-900 dark:text-white">
              {{ t('auth.forgotPassword.successTitle') }}
            </h3>
          </div>
        </template>
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-6">
          {{ t('auth.forgotPassword.successMessage') }}
        </p>
        <UButton color="primary" block :to="`/reset-password`">
          {{ t('auth.forgotPassword.successButton') }}
        </UButton>
      </UCard>
    </div>
  </div>
</template>
