<script setup lang="ts">
import type { AccordionItem } from "@nuxt/ui";

const items = ref<AccordionItem[]>([
  {
    label: "Extra Services",
    slot: "extras",
    icon: "i-lucide-hotel",
  },
  {
    label: "Travelers Information",
    slot: "travelers",
    icon: "i-lucide-users",
  },
  {
    label: "Agency Information",
    slot: "agency",
    icon: "i-lucide-plane",
  },
  {
    label: "Payment Methods",
    slot: "payment",
    icon: "i-lucide-credit-card",
  },
]);
</script>

<template>
  <UPage>
    <template #left>
      <Placeholder />
    </template>

    <UPageBody>
      <UPricingPlan
        title="Hotel Varadero Iberostar"
        description="Nestled in a prime location, the hotel offers a perfect blend of comfort and convenience for the modern traveler. Guests can enjoy elegantly appointed rooms, modern amenities, and personalized service designed to make their stay unforgettable. Whether visiting for business or leisure, the establishment provides a tranquil retreat in the heart of the action."
        :badge="{
          label: 'Varadero, Cuba',
          icon: 'i-lucide-map-pin',
          color: 'warning',
        }"
        tagline="Total"
        price="$549"
        :features="[
          {
            title: 'Stay in shape with a fully equipped gym',
            icon: 'i-lucide-dumbbell',
          },
          {
            title: 'Provides internet access at all times',
            icon: 'i-lucide-wifi',
          },
        ]"
        orientation="horizontal"
      >
      </UPricingPlan>

      <UCard>
        <template #header>
          <div
            class="text-2xl sm:text-3xl text-pretty font-bold text-highlighted"
          >
            <UIcon name="i-lucide-ticket-check" class="size-6" />
            Complete the Reservation
          </div>
        </template>
        <UAccordion
          type="multiple"
          :items="items"
          value-key="slot"
          :default-value="['extras', 'travelers', 'agency', 'payment']"
        >
          <template #extras-body>
            <p>Extras Selection</p>
          </template>

          <template #travelers-body>
            <p>Travelers Form</p>
          </template>

          <template #agency-body>
            <p>Agency Form</p>
          </template>

          <template #payment-body>
            <p>Payment Methods</p>
          </template>
        </UAccordion>
      </UCard>
    </UPageBody>

    <template #right>
      <Placeholder />
    </template>
  </UPage>
</template>
