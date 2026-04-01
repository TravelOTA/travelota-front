<script setup lang="ts">
const { t } = useI18n();
useSeoMeta({ title: t('auth.resetPassword.title') });

const showSuccess = ref(false);
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-16">
    <div class="w-full max-w-md">
      <AuthResetPasswordForm
        v-if="!showSuccess"
        @success="showSuccess = true"
      />

      <UCard v-else class="text-center">
        <template #header>
          <div class="flex items-center justify-center gap-2">
            <UIcon
              name="i-lucide-check-circle"
              class="w-5 h-5 text-success-500"
            />
            <h3 class="font-semibold text-gray-900 dark:text-white">
              {{ t('auth.resetPassword.successTitle') }}
            </h3>
          </div>
        </template>
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-6">
          {{ t('auth.resetPassword.successMessage') }}
        </p>
        <UButton color="primary" block to="/">
          {{ t('auth.resetPassword.successButton') }}
        </UButton>
      </UCard>
    </div>
  </div>
</template>
