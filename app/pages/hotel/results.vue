<script setup lang="ts">
import type { PricingPlanProps } from "@nuxt/ui";

const filterState = ref({
  minPrice: 600,
  maxPrice: 2000,
  hotelName: "",
  nearly: [],
  radius: 10,
});

const hotels = ref<PricingPlanProps[]>([
  {
    title: "Hotel Varadero Resort & Spa",
    description: "Varadero, Cuba",
    price: "$949",
    tagline: "Best Price",
    features: [
      {
        title: "Vault",
        icon: "i-lucide-vault",
      },
      {
        title: "Gym",
        icon: "i-lucide-dumbbell",
      },
      {
        title: "Wifi",
        icon: "i-lucide-wifi",
      },
      {
        title: "Pool",
        icon: "i-lucide-waves-ladder",
      },
    ],
    button: {
      label: "Book now",
    },
  },
  {
    title: "Hotel Paseo del Prado",
    description: "Habana, Cuba",
    price: "$1.499",
    tagline: "Best Price",
    features: [
      {
        title: "Gym",
        icon: "i-lucide-dumbbell",
      },
      {
        title: "Wifi",
        icon: "i-lucide-wifi",
      },
      {
        title: "Pool",
        icon: "i-lucide-waves-ladder",
      },
    ],
    button: {
      label: "Book now",
    },
  },
  {
    title: "Hotel del Cayo",
    description: "Villa Clara, Cuba",
    price: "$1.999",
    tagline: "Best Price",
    features: [
      {
        title: "Boat Travels",
        icon: "i-lucide-sailboat",
      },
      {
        title: "Gym",
        icon: "i-lucide-dumbbell",
      },
      {
        title: "Wifi",
        icon: "i-lucide-wifi",
      },
      {
        title: "Beach",
        icon: "i-lucide-waves",
      },
    ],
    button: {
      label: "Book now",
    },
  },
]);
</script>

<template>
  <UPage>
    <template #left>
      <UCard>
        <template #header>
          <p div="self-center">Filter Header</p>
        </template>

        <UForm>
          <!-- Pricing -->
          <UFormField label="Min Price">
            <UInputNumber
              v-model="filterState.minPrice"
              :format-options="{
                style: 'currency',
                currency: 'USD',
                currencyDisplay: 'code',
                currencySign: 'standard',
              }"
            />
          </UFormField>

          <UFormField label="Max Price">
            <UInputNumber
              v-model="filterState.maxPrice"
              :format-options="{
                style: 'currency',
                currency: 'USD',
                currencyDisplay: 'code',
                currencySign: 'standard',
              }"
            />
          </UFormField>

          <!-- Timespan -->
          <UFormField label="Days of availability">
            <UCalendar range />
          </UFormField>

          <!-- Search by Name -->
          <UFormField label="Find Hotel by name">
            <UInput
              v-model="filterState.hotelName"
              icon="i-lucide-search"
              size="md"
              variant="outline"
              placeholder="Search..."
            />
          </UFormField>

          <!-- Address -->
          <UFormField label="Near the following places">
            <UInputTags
              v-model="filterState.nearly"
              icon="i-lucide-map-pin"
              size="md"
              variant="outline"
            />
          </UFormField>

          <UFormField label="Within a radius of">
            <UInputNumber v-model="filterState.radius" placeholder="Km" />
          </UFormField>

          <!-- Features -->
          <UFormField label="Services">
            <URadioGroup
              size="xl"
              variant="list"
              :required="false"
              :items="[
                'Accommodation and Breakfast',
                'Accommodation Only',
                'Rental House',
                'Room and Meals',
                'Room Only',
                'All Inclusive',
              ]"
            />
          </UFormField>
        </UForm>
      </UCard>
    </template>

    <UPageBody>
      <UPricingPlans :plans="hotels" orientation="vertical" />
    </UPageBody>

    <template #right />
  </UPage>
</template>
