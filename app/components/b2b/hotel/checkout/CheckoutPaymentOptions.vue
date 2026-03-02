<script setup lang="ts">
import { ref } from "vue";

defineProps<{
  totalPrice: number;
  cancellationPolicy: string;
}>();

const paymentMode = ref(1); // 1 = Credit, 2 = Credit Card
const acceptedTerms = ref(false);
const showTerms = ref(false);
const showPolicies = ref(false);
</script>

<template>
  <div
    class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 shadow-sm flex flex-col gap-6"
  >
    <h3
      class="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-sm"
    >
      Pago de su reserva
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Option 1: Credit -->
      <div
        class="border-2 rounded-lg p-5 cursor-pointer transition-colors relative flex flex-col group h-full"
        :class="
          paymentMode === 1
            ? 'border-lime-500 bg-white dark:bg-gray-900'
            : 'border-transparent bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
        "
        @click="paymentMode = 1"
      >
        <div class="flex items-center gap-3 mb-3">
          <UIcon
            name="i-heroicons-document-currency-dollar"
            class="w-6 h-6 text-gray-600 dark:text-gray-300"
          />
          <span class="font-bold text-gray-900 dark:text-white text-lg"
            >Pago con crédito</span
          >
        </div>
        <div class="flex items-start gap-3">
          <URadio v-model="paymentMode" :value="1" class="mt-1" />
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Al seleccionar el "Pago con crédito", le facturaremos a través de su
            línea de crédito.
          </p>
        </div>
      </div>

      <!-- Option 2: Credit Card -->
      <div
        class="border-2 rounded-lg p-5 cursor-pointer transition-colors relative flex flex-col group h-full"
        :class="
          paymentMode === 2
            ? 'border-lime-500 bg-white dark:bg-gray-900'
            : 'border-transparent bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
        "
        @click="paymentMode = 2"
      >
        <div class="flex items-center gap-3 mb-3">
          <UIcon
            name="i-heroicons-credit-card"
            class="w-6 h-6 text-gray-600 dark:text-gray-300"
          />
          <span class="font-bold text-gray-900 dark:text-white text-lg"
            >Pagar por tarjeta de crédito ahora</span
          >
        </div>
        <div class="flex items-start gap-3">
          <URadio v-model="paymentMode" :value="2" class="mt-1" />
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Al seleccionar "Pagar por tarjeta de crédito " será redirigido a
            nuestra pasarela de pagos en la que podrá realizar el pago con su
            tarjeta de crédito. Esta transacción se realizará en un entorno
            seguro.
          </p>
        </div>
      </div>
    </div>

    <!-- Submit Area -->
    <div
      class="mt-8 border-t border-gray-200 dark:border-gray-800 pt-6 flex flex-col items-end gap-6"
    >
      <!-- Total Price -->
      <div class="w-full flex justify-end items-center gap-4">
        <span
          class="text-lg font-bold text-gray-800 dark:text-gray-200 uppercase tracking-tight"
          >Total de la reserva:</span
        >
        <ClientOnly>
          <span class="text-3xl font-black text-gray-900 dark:text-white"
            >${{
              totalPrice.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            }}</span
          >
          <template #fallback>
            <span
              class="text-3xl font-black text-gray-900 dark:text-white opacity-0"
              >${{ totalPrice }}</span
            >
          </template>
        </ClientOnly>
      </div>

      <!-- Actions -->
      <div
        class="flex flex-col md:flex-row items-end md:items-center justify-end gap-6 w-full"
      >
        <!-- Checkbox -->
        <div
          class="flex items-center text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <UCheckbox v-model="acceptedTerms" />
          <span class="ml-3">
            Acepto las
            <a
              class="text-primary-600 dark:text-primary-400 font-bold hover:underline cursor-pointer"
              @click="showTerms = true"
              >Condiciones Generales</a
            >
            y las
            <a
              class="text-primary-600 dark:text-primary-400 font-bold hover:underline cursor-pointer"
              @click="showPolicies = true"
              >Políticas de Cancelación</a
            >
          </span>
        </div>

        <UButton
          size="lg"
          color="primary"
          class="font-bold px-12 shadow-md h-12 text-base"
          :disabled="!acceptedTerms"
        >
          Confirmar Reserva
        </UButton>
      </div>
    </div>

    <!-- Modals -->
    <UModal v-model="showTerms">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
            >
              Condiciones Generales
            </h3>
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="showTerms = false"
            />
          </div>
        </template>
        <div class="text-sm text-gray-600 dark:text-gray-300 space-y-4">
          <p>
            Estas son las condiciones generales de uso y reserva a través de
            TravelOTA B2B.
          </p>
          <p>
            El responsable de la reserva se compromete a facilitar datos
            veraces, así como a abonar la totalidad del importe según las
            condiciones acordadas.
          </p>
          <p>
            Cualquier disputa o reclamación será tratada de acuerdo a las leyes
            vigentes del país de operación.
          </p>
        </div>
      </UCard>
    </UModal>

    <UModal v-model="showPolicies">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
            >
              Políticas de Cancelación
            </h3>
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="showPolicies = false"
            />
          </div>
        </template>
        <div class="text-sm text-gray-600 dark:text-gray-300">
          <p>{{ cancellationPolicy }}</p>
        </div>
      </UCard>
    </UModal>
  </div>
</template>
