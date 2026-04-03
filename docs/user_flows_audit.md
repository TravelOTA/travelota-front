# User Flow Audit: Travelota B2B Platform

This document categorizes every possible user flow by role. These flows are the primary targets for visual validation and E2E automation.

## Roles Overview

- **USER (Agent/Vendedor):** Operations (Search, Quoting, Booking).
- **AGENCY_ADMIN:** Agency management + Operations.
- **SUPPORT:** Platform support and oversight.
- **SUPER_ADMIN:** Full platform control.

---

## 1. Public & Shared Flows

_Accessible to all or before login._

- **[ ] Landing Page:** Home, lead capture, login modal.
- **[ ] Auth Magic Login:** Role selection for development/demo.
- **[ ] Dashboard (Landing):** Global stats (mock), active destinations, promotions.

---

## 2. Operations Flow (USER / Agency Admin)

_The core booking engine._

### Hotel Search

- **[ ] Search Form:** Destination, dates, distribution, nationality selection.
- **[ ] Results Page:** List view, sorting (Price, Quality, Name), sidebar filters.
- **[ ] Map View:** Interactive hotel location mapping.

### Quoting & Itineraries (Quoter)

- **[ ] Add to Itinerary:** Modal selection of blocks from search results.
- **[ ] Quoter Builder:**
  - [ ] Dynamic markup adjustment.
  - [ ] Block management (Hotel, Flight, etc.).
  - [ ] Option limit (Max 5 per block).
- **[ ] Itinerary Preview:** Client-facing document layout.

### Bookings

- **[ ] Checkout Flow:** Passenger data, payment method, mock confirmation.
- **[ ] My Bookings:** Simple list and status view.

---

## 3. Agency Management Flow (AGENCY_ADMIN)

_Scope: Internal Agency scope._

- **[ ] Agency Profile:** Branding, contact info, fiscal data.
- **[ ] User Management:** Creating/editing agents within the agency.
- **[ ] Markup Control:** Setting default margins for the agency.
- **[ ] Global Bookings:** Oversight of all agency reservations.

---

## 4. Platform Administration Flow (SUPPORT / SUPER_ADMIN)

_Scope: Cross-agency platform scope._

- **[ ] Agencies Directory (Global):** List of all registered agencies.
- **[ ] Agency Groups:**
  - [ ] Group creation (VIP, Wholesale, etc.).
  - [ ] Shared markup schemes for groups.
- **[ ] Support Users:** internal staff management.
- **[ ] Booking Oversight (Global):** Platform-wide reservation tracking.
- **[ ] Templates Management:** Email and document customization.

---

## Automation Targets (Playwright)

Each flow above will have a corresponding Playwright script in `tests/e2e/` with the following validation goals:

1. **Functional:** State remains consistent across navigation.
2. **Visual:** Alignment with Design System (Nuxt UI) and responsive integrity.
3. **Role Enforcement:** Verification that restricted pages return 404/Redirect for unauthorized roles.
