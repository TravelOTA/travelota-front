<script setup lang="ts">
import { reactive } from 'vue';

const { t } = useI18n();

const form = reactive({
  nombre: '',
  apellido: '',
  refAgencia: '',
  notas: '',
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
    <div class="grid grid-cols-2 gap-4">
      <UFormField :label="t('cart.checkout.titularName')" required>
        <UInput v-model="form.nombre" :placeholder="t('cart.checkout.titularName')" />
      </UFormField>
      <UFormField :label="t('cart.checkout.titularLastName')" required>
        <UInput v-model="form.apellido" :placeholder="t('cart.checkout.titularLastName')" />
      </UFormField>
      <UFormField :label="t('cart.checkout.agencyRef')" class="col-span-2">
        <UInput v-model="form.refAgencia" :placeholder="t('cart.checkout.agencyRef')" />
      </UFormField>
      <UFormField :label="t('cart.checkout.observations')" class="col-span-2">
        <UTextarea v-model="form.notas" :placeholder="t('cart.checkout.observations')" :rows="3" />
      </UFormField>
    </div>
  </UCard>
</template>
