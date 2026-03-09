# Architecture Design: Dedicated Print Page

## Purpose
Ensure 100% reliable, multi-page PDF generation of Itinerary and Quoter documents from Chromium/WebKit browsers by completely bypassing HeadlessUI Modal reactivity and CSS overflow bugs.

## Approach: Dedicated Route (`/print/...`)
Instead of trying to hack CSS rules over complex DOM trees and Modals, we will open the document to be printed in a brand new, isolated Nuxt route that relies on a blank, unstyled layout.

## Components & Flow
1. **New Layout (`app/layouts/print.vue`)**:
   - Extremely minimal layout. No sidebars, no navbars, no flex min-heights. Pure unstyled HTML block flow perfectly suited for browser paginators.
2. **New Routes (`app/pages/print/itinerary.vue` & `app/pages/print/quoter.vue`)**:
   - Pages that retrieve the data (either from a global store, `localStorage`, or URL query params) and render pure `ItineraryDocument` or `QuoterDocument` components.
   - On `onMounted`, they trigger `window.print()`.
   - On `onafterprint`, they optionally close themselves `window.close()`.
3. **Modal Refactor (Trigger)**:
   - `ItineraryPreviewModal.vue` and `QuoterPreviewModal.vue` will no longer print `window.print()` locally.
   - The "Descargar PDF / Imprimir" button will instead execute `window.open('/print/itinerary', '_blank')`.

## State Management for the New Tab
Since the new tab needs to know *what* to print:
- In Nuxt 3, passing complex reactive state (`useItinerary` and `useQuoter` which are Pinia/State based) across browser tabs reliably can be slightly tricky if the store isn't persisted. 
- To avoid massive URL parameters, the easiest zero-dependency approach is to have the Composables (`useItinerary` / `useQuoter`) temporarily serialize their current state into `localStorage` (e.g. `_print_itinerary_data`) right before calling `window.open()`.
- The new tab reads `localStorage.getItem('_print_itinerary_data')` synchronously, hydrates a local ref, and prints. The UX is instantaneous.

## Success Criteria
- Native Chromium Print dialog renders all pages without cropping.
- Clicking print opens a new tab, triggers the print dialog, and doesn't crash the main app.
