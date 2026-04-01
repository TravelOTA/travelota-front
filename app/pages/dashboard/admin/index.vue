<script setup lang="ts">
import { useStats } from '~/composables/useStats';

definePageMeta({
  layout: 'dashboard',
});

useHead({
  title: 'Portal de Administración - TravelOTA',
});

const { t } = useI18n();
const { adminStats } = useStats();

const fmtCurrency = (v: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(v);
</script>

<template>
  <div class="max-w-7xl mx-auto">
    <div class="mb-8 flex items-center gap-3">
      <UIcon name="i-heroicons-shield-check" class="w-8 h-8 text-primary" />
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          {{ t('admin.dashboard.title') }}
        </h1>
        <p class="text-gray-500 dark:text-gray-400">
          {{ t('admin.dashboard.subtitle') }}
        </p>
      </div>
    </div>

    <!-- Stats Globales -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <UCard>
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400"
          >
            <UIcon name="i-heroicons-building-office" class="w-6 h-6" />
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">
              {{ t('admin.dashboard.stats.activeAgencies') }}
            </p>
            <p class="text-2xl font-bold">{{ adminStats.activeAgencies }}</p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400"
          >
            <UIcon name="i-heroicons-document-check" class="w-6 h-6" />
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">
              {{ t('admin.dashboard.stats.monthlyBookings') }}
            </p>
            <p class="text-2xl font-bold">{{ adminStats.totalBookings }}</p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400"
          >
            <UIcon name="i-heroicons-currency-dollar" class="w-6 h-6" />
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">
              {{ t('admin.dashboard.stats.netVolume') }}
            </p>
            <p class="text-2xl font-bold">
              {{ fmtCurrency(adminStats.totalNetVolume) }}
            </p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400"
          >
            <UIcon name="i-heroicons-users" class="w-6 h-6" />
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">
              {{ t('admin.dashboard.stats.supportAgents') }}
            </p>
            <p class="text-2xl font-bold">{{ adminStats.totalSupportUsers }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Accesos Rápidos Admin -->
    <h2 class="text-xl font-bold mb-4 text-gray-800 dark:text-white">
      {{ t('admin.dashboard.platformManager') }}
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard
        class="cursor-pointer hover:border-primary-500 transition-colors"
        @click="$router.push('/dashboard/admin/agencies')"
      >
        <div class="p-2">
          <div
            class="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 text-primary-500 rounded-lg flex items-center justify-center mb-4"
          >
            <UIcon name="i-heroicons-building-storefront" class="w-6 h-6" />
          </div>
          <h3 class="font-bold text-lg mb-1">
            {{ t('admin.dashboard.agencies.title') }}
          </h3>
          <p class="text-sm text-gray-500">
            {{ t('admin.dashboard.agencies.description') }}
          </p>
        </div>
        <template #footer>
          <div
            class="flex items-center justify-between text-primary text-sm font-semibold"
          >
            {{ t('admin.dashboard.agencies.manage') }}
            <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
          </div>
        </template>
      </UCard>

      <UCard
        class="cursor-pointer hover:border-primary-500 transition-colors"
        @click="$router.push('/dashboard/admin/support-users')"
      >
        <div class="p-2">
          <div
            class="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 text-primary-500 rounded-lg flex items-center justify-center mb-4"
          >
            <UIcon name="i-heroicons-user-group" class="w-6 h-6" />
          </div>
          <h3 class="font-bold text-lg mb-1">
            {{ t('admin.dashboard.supportUsers.title') }}
          </h3>
          <p class="text-sm text-gray-500">
            {{ t('admin.dashboard.supportUsers.description') }}
          </p>
        </div>
        <template #footer>
          <div
            class="flex items-center justify-between text-primary text-sm font-semibold"
          >
            {{ t('admin.dashboard.supportUsers.manage') }}
            <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
          </div>
        </template>
      </UCard>

      <UCard
        class="cursor-pointer hover:border-primary-500 transition-colors"
        @click="$router.push('/dashboard/admin/bookings')"
      >
        <div class="p-2">
          <div
            class="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 text-primary-500 rounded-lg flex items-center justify-center mb-4"
          >
            <UIcon name="i-heroicons-briefcase" class="w-6 h-6" />
          </div>
          <h3 class="font-bold text-lg mb-1">
            {{ t('admin.dashboard.allBookings.title') }}
          </h3>
          <p class="text-sm text-gray-500">
            {{ t('admin.dashboard.allBookings.description') }}
          </p>
        </div>
        <template #footer>
          <div
            class="flex items-center justify-between text-primary text-sm font-semibold"
          >
            {{ t('admin.dashboard.allBookings.manage') }}
            <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
          </div>
        </template>
      </UCard>
      <UCard
        class="cursor-pointer hover:border-primary-500 transition-colors"
        @click="$router.push('/dashboard/admin/agency-groups')"
      >
        <div class="p-2">
          <div
            class="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 text-primary-500 rounded-lg flex items-center justify-center mb-4"
          >
            <UIcon name="i-heroicons-user-group" class="w-6 h-6" />
          </div>
          <h3 class="font-bold text-lg mb-1">
            {{ t('admin.dashboard.agencyGroups.title') }}
          </h3>
          <p class="text-sm text-gray-500">
            {{ t('admin.dashboard.agencyGroups.description') }}
          </p>
        </div>
        <template #footer>
          <div
            class="flex items-center justify-between text-primary text-sm font-semibold"
          >
            {{ t('admin.dashboard.agencyGroups.manage') }}
            <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
          </div>
        </template>
      </UCard>
      <UCard
        class="cursor-pointer hover:border-primary-500 transition-colors"
        @click="$router.push('/dashboard/admin/deposit-requests')"
      >
        <div class="p-2">
          <div
            class="w-10 h-10 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-lg flex items-center justify-center mb-4"
          >
            <UIcon name="i-heroicons-banknotes" class="w-6 h-6" />
          </div>
          <h3 class="font-bold text-lg mb-1">
            {{ t('admin.dashboard.depositRequests.title') }}
          </h3>
          <p class="text-sm text-gray-500">
            {{ t('admin.dashboard.depositRequests.description') }}
          </p>
        </div>
        <template #footer>
          <div
            class="flex items-center justify-between text-primary text-sm font-semibold"
          >
            {{ t('admin.dashboard.depositRequests.manage') }}
            <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>
