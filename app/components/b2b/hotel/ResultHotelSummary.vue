<script setup lang="ts">
import { useItinerary } from '~/composables/useItinerary';
import { useNetPrice } from '~/composables/useNetPrice';
import { useSalePrice } from '~/composables/useSalePrice';

const { t } = useI18n();

const props = defineProps<{
  hotel: {
    hotel_code: string;
    hotel_name: string;
    category: number;
    thumbnail: string | null;
    destination_name: string;
    best_price: number;
  };
}>();

const emit = defineEmits<{
  (e: 'open-map', hotel: Record<string, any>): void;
}>();
const { triggerAddOption } = useItinerary();

const addToItinerary = () => {
  triggerAddOption({
    providerId: String(props.hotel.hotel_code),
    name: props.hotel.hotel_name,
    image:
      props.hotel.thumbnail ||
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
    description: props.hotel.destination_name + ' - Alojamiento Completo',
    netPrice: props.hotel.best_price,
    isManual: false,
  });
};

const { netPriceVisible } = useNetPrice();
const { salePrice } = useSalePrice();
</script>

<template>
  <div
    class="flex flex-col md:flex-row bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-t-lg overflow-hidden"
  >
    <!-- Imagen -->
    <NuxtLink
      :to="`/dashboard/hotels/${hotel.hotel_code}`"
      class="relative w-full md:w-64 h-48 shrink-0 cursor-pointer block"
    >
      <img
        :src="hotel.thumbnail || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800'"
        :alt="hotel.hotel_name"
        class="w-full h-full object-cover"
      />
    </NuxtLink>

    <!-- Info Central -->
    <div class="p-4 flex-1 flex flex-col justify-between">
      <div>
        <div class="flex text-yellow-400 mb-1">
          <UIcon
            v-for="i in hotel.category"
            :key="i"
            name="i-heroicons-star-16-solid"
            class="w-4 h-4"
          />
        </div>
        <NuxtLink :to="`/dashboard/hotels/${hotel.hotel_code}`">
          <h3
            class="text-lg font-bold text-gray-900 dark:text-white hover:text-primary-600 transition-colors"
          >
            {{ hotel.hotel_name }}
          </h3>
        </NuxtLink>

        <div
          class="flex items-center text-sm text-gray-500 mb-4 cursor-pointer hover:text-gray-700"
          @click="emit('open-map', hotel)"
        >
          <UIcon name="i-heroicons-map-pin" class="w-4 h-4 mr-1" />
          <span>{{ hotel.destination_name }}</span>
          <span class="ml-2 underline underline-offset-2">{{
            t('hotels.results.seeOnMap')
          }}</span>
        </div>
      </div>
    </div>

    <!-- Bloque de Precio (Mejor Precio) -->
    <div
      class="p-4 md:w-48 shrink-0 flex flex-col justify-center items-end text-right border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-800"
    >
      <p
        class="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1 leading-tight text-right w-full"
      >
        {{ t('hotels.results.bestPrice') }}<br />{{
          t('hotels.results.perStay')
        }}
      </p>
      <p
        class="text-3xl font-light text-gray-900 dark:text-white tracking-tight mb-2"
      >
        <span class="font-bold">$</span>
        {{
          salePrice(hotel.best_price).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        }}
      </p>
      <p v-if="netPriceVisible" class="text-xs text-gray-400 mb-2">
        neto ${{
          hotel.best_price.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        }}
      </p>

      <UButton
        color="neutral"
        variant="solid"
        icon="i-heroicons-document-plus"
        class="mt-auto w-full justify-center"
        size="sm"
        @click.prevent="addToItinerary"
      >
        {{ t('hotels.results.quoteItinerary') }}
      </UButton>
    </div>
  </div>
</template>
