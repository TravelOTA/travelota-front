<script setup lang="ts">
import HotelSearchForm from '~/components/b2b/hotel/HotelSearchForm.vue';
import B2bLandingPromotionCard from '~/components/b2b/landing/PromotionCard.vue';
import { useStats } from '~/composables/useStats';
import {
  useHotelSearch,
  type HotelSearchParams,
} from '~/composables/useHotelSearch';

const { t } = useI18n();

definePageMeta({
  layout: 'dashboard',
});

useHead({
  title: 'Buscador de Hoteles - Portal B2B',
});

const { promotions } = usePromotions();
const { b2bStats } = useStats();
const { navigateToResults } = useHotelSearch();

const handleSearch = async (data: HotelSearchParams) => {
  await navigateToResults(data);
};

const handlePromotionSearch = async (destination: string) => {
  await navigateToResults({
    destination,
    checkIn: '',
    checkOut: '',
    nationality: 'Estados Unidos',
    distribution: '1 Habitación, 2 Adultos',
  });
};

const processedStats = computed(() => [
  {
    label: t('dashboard.stats.activeBookings'),
    value: b2bStats.value.activeBookings.toString(),
    icon: 'i-heroicons-briefcase',
    iconBg: 'bg-primary-50 dark:bg-primary-950',
    iconColor: 'text-primary-500',
  },
  {
    label: t('dashboard.stats.availableHotels'),
    value: b2bStats.value.availableHotels,
    icon: 'i-heroicons-building-office-2',
    iconBg: 'bg-blue-50 dark:bg-blue-950',
    iconColor: 'text-blue-500',
  },
  {
    label: t('dashboard.stats.activeDestinations'),
    value: b2bStats.value.activeDestinations.toString(),
    icon: 'i-heroicons-map-pin',
    iconBg: 'bg-amber-50 dark:bg-amber-950',
    iconColor: 'text-amber-500',
  },
  {
    label: t('dashboard.stats.monthlyBookings'),
    value: b2bStats.value.monthlyBookings.toString(),
    icon: 'i-heroicons-calendar-days',
    iconBg: 'bg-green-50 dark:bg-green-950',
    iconColor: 'text-green-500',
  },
]);
</script>

<template>
  <div class="max-w-7xl mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {{ $t('dashboard.searchHotels') }}
      </h1>
      <p class="text-gray-500 dark:text-gray-400">
        {{ $t('dashboard.searchHotelsSubtitle') }}
      </p>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <UCard
        v-for="stat in processedStats"
        :key="stat.label"
        class="border border-gray-100 dark:border-gray-800"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            :class="stat.iconBg"
          >
            <UIcon :name="stat.icon" class="w-5 h-5" :class="stat.iconColor" />
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ stat.value }}
            </p>
            <p
              class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              {{ stat.label }}
            </p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Buscador Principal -->
    <div class="mb-10">
      <HotelSearchForm @search="handleSearch" />
    </div>

    <!-- Promociones Destacadas -->
    <div>
      <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-6">
        {{ $t('dashboard.featuredDestinations') }}
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <B2bLandingPromotionCard
          v-for="promo in promotions"
          :key="promo.id"
          :promotion="promo"
          @search="handlePromotionSearch"
        />
      </div>
    </div>
  </div>
</template>
