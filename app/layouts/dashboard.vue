<script setup lang="ts">
import AddToItineraryModal from '~/components/b2b/quoter/AddToItineraryModal.vue';
import CartDrawer from '~/components/b2b/cart/CartDrawer.vue';
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
    <DashboardNavbar />

    <main class="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>

    <AppFooter />

    <AddToItineraryModal />
    <CartDrawer />
  </div>
</template>
