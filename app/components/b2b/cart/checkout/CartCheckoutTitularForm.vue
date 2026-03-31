<script setup lang="ts">
import { reactive } from 'vue';

const { t } = useI18n();

const form = reactive({
  nombre: '',
  apellido: '',
  refAgencia: '',
  email: '',
});

defineExpose({ form });
</script>

<template>
  <UCard>
    <template #header>
      <h3 class="font-bold text-gray-900 dark:text-white text-sm">
        {{ t('cart.checkout.titular') }}
      </h3>
    </template>
    <div class="flex flex-col gap-4">
      <!-- Row 1: 3 columns -->
      <div class="grid grid-cols-3 gap-4">
        <UFormField :label="t('cart.checkout.titularName')" required>
          <UInput v-model="form.nombre" :placeholder="t('cart.checkout.titularName')" />
        </UFormField>
        <UFormField :label="t('cart.checkout.titularLastName')" required>
          <UInput v-model="form.apellido" :placeholder="t('cart.checkout.titularLastName')" />
        </UFormField>
        <UFormField :label="t('cart.checkout.agencyRef')">
          <UInput v-model="form.refAgencia" :placeholder="t('cart.checkout.agencyRef')" />
        </UFormField>
      </div>
      <!-- Row 2: email full width -->
      <UFormField :label="t('cart.checkout.titularEmail')" required>
        <UInput
          v-model="form.email"
          type="email"
          :placeholder="t('cart.checkout.titularEmail')"
        />
      </UFormField>
    </div>
  </UCard>
</template>
