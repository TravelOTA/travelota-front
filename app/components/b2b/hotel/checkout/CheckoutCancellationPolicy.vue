<script setup lang="ts">
const { t } = useI18n();

defineProps<{
  total: number;
  policies: {
    status: string;
    fromDate: string;
    toDate: string;
    time: string;
    price: number;
  }[];
}>();
</script>

<template>
  <div
    class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5"
  >
    <h3
      class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"
    >
      <UIcon
        name="i-heroicons-shield-exclamation"
        class="w-5 h-5 text-primary-500"
      />
      {{ t('hotels.cancellationPolicy.title') }}
    </h3>

    <div class="mb-4">
      <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('hotels.cancellationPolicy.total') }} </span>
      <span class="font-bold text-gray-900 dark:text-white"
        >${{
          total.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        }}</span
      >
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm whitespace-nowrap">
        <thead>
          <tr
            class="border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
          >
            <th class="py-2 pr-4 font-bold">{{ t('hotels.cancellationPolicy.costsHeader') }}</th>
            <th class="py-2 pr-4 font-bold">{{ t('hotels.cancellationPolicy.fromDate') }}</th>
            <th class="py-2 pr-4 font-bold">{{ t('hotels.cancellationPolicy.toDate') }}</th>
            <th class="py-2 pr-4 font-bold">{{ t('hotels.cancellationPolicy.time') }}</th>
            <th class="py-2 font-bold">{{ t('hotels.cancellationPolicy.price') }}</th>
          </tr>
        </thead>
        <tbody
          class="divide-y divide-gray-100 dark:divide-gray-800 text-gray-600 dark:text-gray-300"
        >
          <tr
            v-for="(policy, idx) in policies"
            :key="idx"
            class="hover:bg-gray-50 dark:hover:bg-gray-800/50"
          >
            <td class="py-2.5 pr-4">{{ policy.status }}</td>
            <td class="py-2.5 pr-4">{{ policy.fromDate }}</td>
            <td class="py-2.5 pr-4">{{ policy.toDate }}</td>
            <td class="py-2.5 pr-4">{{ policy.time }}</td>
            <td class="py-2.5 font-bold text-gray-900 dark:text-white">
              ${{
                policy.price.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
