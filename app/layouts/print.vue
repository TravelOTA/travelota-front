<template>
  <div class="print-layout-root bg-white min-h-screen w-full">
    <slot />
  </div>
</template>

<style>
/* 
 * CRITICAL HTML/BODY PRINT RESET
 * Ensures that any underlying Nuxt/Vue structure drops all flex/height constraints
 * allowing WebKit/Chromium to paginate long documents natively.
 */
@media print {
  html,
  body,
  #__nuxt,
  [data-v-app],
  .print-layout-root {
    overflow: visible !important;
    height: auto !important;
    max-height: none !important;
    min-height: auto !important;
    position: static !important;
    display: block !important;
    margin: 0 !important;
    padding: 0 !important;
    background-color: white !important;
  }
}
</style>
