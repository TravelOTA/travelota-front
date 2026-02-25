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
          <div>Filters</div>
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
      </UCard>
    </template>

    <UPageBody>
      <UPricingPlans :plans="hotels" orientation="vertical" compact>
        <template #button>
          <div class="flex gap-2">
            <UButton label="Book now" icon="i-lucide-book-marked" />
            <UButton label="More options" icon="i-lucide-circle-ellipsis" />
          </div>
        </template>
      </UPricingPlans>
    </UPageBody>

    <template #right />
  </UPage>
</template>
