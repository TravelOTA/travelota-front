# Print Tab Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Refactor both the Quoter and Itinerary printing mechanisms to open a dedicated, isolated tab (`/print/*`) that renders pure HTML specifically tailored for native browser PDF generation, bypassing all modal/flexbox CSS bugs.

**Architecture:** We will create a `print` layout that removes all UI chrome. We will create two new pages (`/print/itinerary` and `/print/quoter`) using Vue Router. The `useItinerary` and `useQuoter` composables will explicitly save their state to `localStorage` before opening the new tab, and the new tab will hydrate from `localStorage` on mount before triggering `window.print()`.

**Tech Stack:** Nuxt 3, Vue 3, LocalStorage, TailwindCSS

---

### Task 1: Refactor `ItineraryDocument`
Extract the internal presentation layer of the currently reverted `ItineraryPreviewModal` back into an independent `ItineraryDocument.vue` component so both the Modal and the new Print Page can share the exact same UI structure.
**Files:**
- Create: `app/components/b2b/quoter/ItineraryDocument.vue` (Copy logic from Modal content area)
- Modify: `app/components/b2b/quoter/ItineraryPreviewModal.vue` (Make it consume the document component)

### Task 2: Refactor `QuoterDocument`
Same as Task 1, extract the flat representation of the fast quote into a reusable component.
**Files:**
- Create: `app/components/b2b/quoter/QuoterDocument.vue`
- Modify: `app/components/b2b/quoter/QuoterPreviewModal.vue`

### Task 3: Create the Print Layout
Create the barebones print layout that has zero CSS flexbox or padding wrappers.
**Files:**
- Create: `app/layouts/print.vue`
**Steps:** Setup a minimal `<template><slot /></template>` without any `div.flex` wrappers.

### Task 4: Create Print Pages and LocalStorage Sync
Create the dedicated nuxt pages that read from localStorage and auto-print.
**Files:**
- Create: `app/pages/print/itinerary.vue`
- Create: `app/pages/print/quoter.vue`
**Steps:** 
1. `definePageMeta({ layout: 'print' })`.
2. Sync data via `localStorage`.
3. Add `onMounted(() => { setTimeout(() => window.print(), 500) })`.

### Task 5: Modify Print Button Triggers
Change functionality in `ItineraryPreviewModal` and `QuoterPreviewModal`.
**Files:**
- Modify: `app/components/b2b/quoter/ItineraryPreviewModal.vue`
- Modify: `app/components/b2b/quoter/QuoterPreviewModal.vue`
**Steps:** Replace `window.print()` with a function that writes to `localStorage` and does `window.open('/print/xxx', '_blank')`.
