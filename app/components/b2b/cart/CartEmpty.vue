<!-- app/components/b2b/cart/CartEmpty.vue -->
<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
    <UIcon
      name="i-heroicons-shopping-cart"
      class="w-14 h-14 text-gray-300 dark:text-gray-600 mb-4"
    />
    <p class="text-gray-700 dark:text-gray-300 font-semibold text-base mb-1">
      {{ t('cart.empty') }}
    </p>
    <p class="text-gray-500 dark:text-gray-400 text-sm">
      {{ t('cart.emptyDescription') }}
    </p>
  </div>
</template>
