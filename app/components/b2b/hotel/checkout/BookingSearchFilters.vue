<script setup lang="ts">
import { reactive, computed } from "vue";

const { t } = useI18n();

interface Props {
  showAgencyFilter?: boolean;
  showSellerFilter?: boolean;
  agencyOptions?: string[];
  sellerOptions?: string[];
  statusOptions?: { label: string; value: string }[];
}

const props = withDefaults(defineProps<Props>(), {
  showAgencyFilter: false,
  showSellerFilter: false,
  agencyOptions: () => [],
  sellerOptions: () => [],
  statusOptions: () => [],
});

const resolvedStatusOptions = computed(() =>
  props.statusOptions.length > 0
    ? props.statusOptions
    : [
        { label: t('hotels.bookingStatusLabel.confirmed'), value: "confirmed" },
        { label: t('hotels.bookingStatusLabel.cancelled'), value: "cancelled" },
        { label: t('hotels.bookingStatusLabel.expired'), value: "expired" },
      ],
);

interface FilterPayload {
  pnr: string;
  titular: string;
  destination: string;
  statuses: string[];
  paymentStatuses: string[];
  createdFrom: string;
  createdTo: string;
  checkInFrom: string;
  checkInTo: string;
  agency: string;
  seller: string;
  [key: string]: string | string[];
}

const emit = defineEmits<{
  (e: "search", filters: FilterPayload): void;
  (e: "clear"): void;
}>();

const filters = reactive({
  pnr: "",
  titular: "",
  destination: "",
  statuses: [] as string[],
  paymentStatuses: [] as string[],
  createdFrom: "",
  createdTo: "",
  checkInFrom: "",
  checkInTo: "",
  agency: "",
  seller: "",
});

const handleSearch = () => {
  emit("search", { ...filters });
};

const handleClear = () => {
  filters.pnr = "";
  filters.titular = "";
  filters.destination = "";
  filters.statuses = [];
  filters.paymentStatuses = [];
  filters.createdFrom = "";
  filters.createdTo = "";
  filters.checkInFrom = "";
  filters.checkInTo = "";
  filters.agency = "";
  filters.seller = "";
  emit("clear");
};

const hasActiveFilters = computed(() => {
  return (
    filters.pnr ||
    filters.titular ||
    filters.destination ||
    filters.statuses.length > 0 ||
    filters.paymentStatuses.length > 0 ||
    filters.createdFrom ||
    filters.createdTo ||
    filters.checkInFrom ||
    filters.checkInTo ||
    filters.agency ||
    filters.seller
  );
});
</script>

<template>
  <div
    class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm"
  >
    <div class="flex items-center gap-3 mb-6">
      <div
        class="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center"
      >
        <UIcon
          name="i-heroicons-magnifying-glass"
          class="w-5 h-5 text-primary-500"
        />
      </div>
      <div>
        <h2 class="text-lg font-bold text-gray-900 dark:text-white">
          {{ t('bookings.filters.title') }}
        </h2>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          {{ t('bookings.filters.subtitle') }}
        </p>
      </div>
    </div>

    <form @submit.prevent="handleSearch">
      <!-- Row 1: Text search fields -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <UFormField :label="t('bookings.filters.pnrLabel')">
          <UInput
            v-model="filters.pnr"
            :placeholder="t('bookings.filters.pnrPlaceholder')"
            icon="i-heroicons-document-text"
            class="w-full"
          />
        </UFormField>

        <UFormField :label="t('bookings.filters.titularLabel')">
          <UInput
            v-model="filters.titular"
            :placeholder="t('bookings.filters.titularPlaceholder')"
            icon="i-heroicons-user"
            class="w-full"
          />
        </UFormField>

        <UFormField :label="t('bookings.filters.destinationLabel')">
          <UInput
            v-model="filters.destination"
            :placeholder="t('bookings.filters.destinationPlaceholder')"
            icon="i-heroicons-map-pin"
            class="w-full"
          />
        </UFormField>
      </div>

      <!-- Row 2: Agency (opcional) - solo si NO hay seller también -->
      <div
        v-if="props.showAgencyFilter && !props.showSellerFilter"
        class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"
      >
        <UFormField :label="t('bookings.filters.agencyLabel')">
          <USelectMenu
            v-model="filters.agency"
            :items="['Todas', ...props.agencyOptions]"
            :placeholder="t('bookings.filters.allAgencies')"
            icon="i-heroicons-building-storefront"
            class="w-full"
          />
        </UFormField>
      </div>

      <!-- Row 3: Fechas -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <UFormField :label="t('bookings.filters.createdFrom')">
          <UInput v-model="filters.createdFrom" type="date" class="w-full" />
        </UFormField>

        <UFormField :label="t('bookings.filters.createdTo')">
          <UInput v-model="filters.createdTo" type="date" class="w-full" />
        </UFormField>

        <UFormField :label="t('bookings.filters.checkInFrom')">
          <UInput v-model="filters.checkInFrom" type="date" class="w-full" />
        </UFormField>

        <UFormField :label="t('bookings.filters.checkInTo')">
          <UInput v-model="filters.checkInTo" type="date" class="w-full" />
        </UFormField>
      </div>

      <!-- Row 4: Estado Reserva + Estado Pago -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <UFormField :label="t('bookings.filters.bookingStatus')">
          <USelectMenu
            v-model="filters.statuses"
            :items="resolvedStatusOptions"
            multiple
            :placeholder="t('bookings.filters.allStatuses')"
            value-key="value"
            class="w-full"
          />
        </UFormField>

        <UFormField :label="t('bookings.filters.paymentStatus')">
          <USelectMenu
            v-model="filters.paymentStatuses"
            :items="[
              { label: 'Pagada', value: 'Pagada' },
              { label: 'Pendiente Pago', value: 'Pendiente Pago' },
            ]"
            multiple
            :placeholder="t('bookings.filters.allPayments')"
            value-key="value"
            class="w-full"
          />
        </UFormField>
      </div>

      <!-- Row 4: Agencia + Vendedor juntos (cuando ambos activos, Agencia primero) -->
      <div
        v-if="props.showAgencyFilter && props.showSellerFilter"
        class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
      >
        <UFormField :label="t('bookings.filters.agencyLabel')">
          <USelectMenu
            v-model="filters.agency"
            :items="['Todas', ...props.agencyOptions]"
            :placeholder="t('bookings.filters.allAgencies')"
            icon="i-heroicons-building-storefront"
            class="w-full"
          />
        </UFormField>
        <UFormField :label="t('bookings.filters.sellerLabel')">
          <USelectMenu
            v-model="filters.seller"
            :items="['Todos', ...props.sellerOptions]"
            :placeholder="t('bookings.filters.allSellers')"
            icon="i-heroicons-user-circle"
            class="w-full"
          />
        </UFormField>
      </div>

      <!-- Row 4b: Solo Vendedor (cuando no hay agencia) -->
      <div
        v-if="props.showSellerFilter && !props.showAgencyFilter"
        class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"
      >
        <UFormField :label="t('bookings.filters.sellerLabel')">
          <USelectMenu
            v-model="filters.seller"
            :items="['Todos', ...props.sellerOptions]"
            :placeholder="t('bookings.filters.allSellers')"
            icon="i-heroicons-user-circle"
            class="w-full"
          />
        </UFormField>
      </div>

      <!-- Action Buttons -->
      <div
        class="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800"
      >
        <div class="flex items-center gap-2">
          <UBadge
            v-if="hasActiveFilters"
            color="primary"
            variant="subtle"
            class="text-xs"
          >
            {{ t('bookings.filters.active') }}
          </UBadge>
        </div>
        <div class="flex items-center gap-3">
          <UButton
            type="button"
            color="neutral"
            variant="ghost"
            icon="i-heroicons-x-mark"
            class="font-medium"
            :disabled="!hasActiveFilters"
            @click="handleClear"
          >
            {{ t('bookings.filters.clear') }}
          </UButton>
          <UButton
            type="submit"
            color="primary"
            icon="i-heroicons-magnifying-glass"
            class="font-bold px-6"
            size="lg"
          >
            {{ t('bookings.filters.search') }}
          </UButton>
        </div>
      </div>
    </form>
  </div>
</template>
