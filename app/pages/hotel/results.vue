<script setup lang="ts">
import type { PricingPlanProps } from "@nuxt/ui";

const dummyDescription =
  "Nestled in a prime location, the hotel offers a perfect blend of comfort and convenience for the modern traveler. Guests can enjoy elegantly appointed rooms, modern amenities, and personalized service designed to make their stay unforgettable. Whether visiting for business or leisure, the establishment provides a tranquil retreat in the heart of the action.";

const filterState = ref({
  minPrice: 600,
  maxPrice: 2000,
  hotelName: "",
  nearly: [],
  radius: 10,
});

const hotels = ref<PricingPlanProps[]>([
  {
    title: "Hotel Varadero Iberostar",
    description: dummyDescription,
    badge: {
      label: "Varadero, Cuba",
      icon: "i-lucide-map-pin",
      color: "warning",
    },
    price: "$549",
    tagline: "Best Price",
    features: [
      {
        title: "Stay in shape with a fully equipped gym",
        icon: "i-lucide-dumbbell",
      },
      {
        title: "Provides internet access at all times",
        icon: "i-lucide-wifi",
      },
    ],
    button: {
      label: "Book now",
    },
  },
  {
    title: "Hotel Varadero Resort & Spa",
    description: dummyDescription,
    badge: {
      label: "Varadero, Cuba",
      icon: "i-lucide-map-pin",
      color: "warning",
    },
    price: "$849",
    tagline: "Best Price",
    features: [
      {
        title: "Stay in shape with a fully equipped gym",
        icon: "i-lucide-dumbbell",
      },
      {
        title: "Provides internet access at all times",
        icon: "i-lucide-wifi",
      },
      {
        title: "Excellent pool condition",
        icon: "i-lucide-waves-ladder",
      },
    ],
    button: {
      label: "Book now",
    },
  },
  {
    title: "Hotel Paseo del Prado",
    description: dummyDescription,
    badge: {
      label: "Habana, Cuba",
      icon: "i-lucide-map-pin",
      color: "warning",
    },
    price: "$1.599",
    discount: "1.299",
    tagline: "Best Price",
    features: [
      {
        title: "Offers security vault for personal belongings",
        icon: "i-lucide-vault",
      },
      {
        title: "Stay in shape with a fully equipped gym",
        icon: "i-lucide-dumbbell",
      },
      {
        title: "Provides internet access on rooms",
        icon: "i-lucide-wifi",
      },
      {
        title: "Large pool to hang out in",
        icon: "i-lucide-waves-ladder",
      },
    ],
    button: {
      label: "Book now",
    },
  },
  {
    title: "Hotel del Cayo",
    description: dummyDescription,
    badge: {
      label: "Villa Clara, Cuba",
      icon: "i-lucide-map-pin",
      color: "warning",
    },
    price: "$1.999",
    tagline: "Best Price",
    features: [
      {
        title: "Tourist trips to nature reserves",
        icon: "i-lucide-sailboat",
      },
      {
        title: "Stay in shape with a fully equipped gym",
        icon: "i-lucide-dumbbell",
      },
      {
        title: "Provides internet access on rooms",
        icon: "i-lucide-wifi",
      },
      {
        title: "Enjoy a beachwith clean water and fine sand",
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
          <div class="flex flex-row justify-between gap-4">
            <div class="text-highlighted text-xl text-pretty font-semibold">
              Advanced Filters
            </div>
            <UButton class="" icon="i-lucide-search" />
          </div>
        </template>

        <UScrollArea class="h-200 w-full" :ui="{ viewport: 'gap-4 p-4' }">
          <UForm class="flex flex-col gap-6 w-fill self-center">
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
            <UFormField label="Days of Availability">
              <UCalendar range />
            </UFormField>

            <!-- Search by Name -->
            <UFormField label="Find Hotel">
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

            <UFormField label="Within a Radius">
              <UInputNumber v-model="filterState.radius" placeholder="Km" />
            </UFormField>

            <!-- Features -->
            <UFormField label="Services">
              <URadioGroup
                size="xl"
                variant="list"
                required
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
        </UScrollArea>
      </UCard>
    </template>

    <UPageBody>
      <UScrollArea class="h-200 w-full" :ui="{ viewport: 'gap-4 p-4' }">
        <UPricingPlans :plans="hotels" orientation="vertical" compact>
          <template #button>
            <div class="flex gap-2">
              <UButton label="Book now" icon="i-lucide-book-marked" />
              <UButton label="More options" icon="i-lucide-circle-ellipsis" />
            </div>
          </template>
        </UPricingPlans>
      </UScrollArea>
    </UPageBody>

    <template #right />
  </UPage>
</template>
