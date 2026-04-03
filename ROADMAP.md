# travelota-front — Frontend Roadmap

> Tracks frontend-specific work: UI state, composable integration, and client-side features.
> For backend tasks see `travelota-api/ROADMAP.md`. For the full-stack view see `project-management/ROADMAP.md`.

---

## Current State — UI Prototype (Phase 0 Complete ✅)

All flows are built and polished with mock data. `useApi()` is wired and injects `Authorization: Bearer` headers — composables only need their mock arrays replaced with real calls.

### Implemented (UI + Mock Data)

| Module                | What's built                                                                                                              |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Auth**              | Login/register forms (Zod), role cookie simulation, auth middleware on `/dashboard/**`, magic dev panel                   |
| **Hotel Search**      | Search form, URL-persisted params, results grid/list, advanced filters, hotel detail, Leaflet map                         |
| **Quoter**            | Cart, markup slider, profit margin visualization, print-ready `QuoterDocument.vue`                                        |
| **Itinerary Builder** | Multiday blocks (hotel/flight/transfer/activity), 5 options per block, child pricing, print-ready `ItineraryDocument.vue` |
| **Checkout**          | Full flow, payment method selector (card/transfer/credit/pay-later), credit availability check, booking confirmation      |
| **Bookings**          | List with filters, client-side pagination, bulk selection, voucher modal                                                  |
| **Wallet**            | Credit limit widget, transaction history, `AgencyTransactions` + `WalletWidgets`                                          |
| **Agency Profile**    | Editor, logo upload + preview, color picker with dynamic theming, markup config, user list                                |
| **Admin Panel**       | Stats dashboard, agency CRUD (approve/block/edit), group tiers, support user CRUD, templates page                         |
| **UI Foundation**     | Nuxt UI v4 + Tailwind v4, green palette, `print` layout, fully responsive, Spanish                                        |

---

## Phase 1 — Backend Integration

### 1.1 Authentication

- [ ] Call `POST /auth/token` on login — store access token in memory, refresh token in `httpOnly` cookie
- [ ] Implement silent token refresh before the 5-min access token expires
- [ ] Replace `travelota-role` cookie with role decoded from JWT claims
- [ ] Connect logout to clear tokens client-side
- [ ] Wire registration form to real endpoint (when backend exposes it)
- [ ] Password reset form — link from login page to `POST /auth/password-reset`

### 1.2 User Profile

- [ ] `GET /auth/me` → populate user name/email/phone in navbar and profile page
- [ ] `PATCH /auth/me` → save profile changes
- [ ] `POST /auth/me/change-password` → connect password change form

### 1.3 Agency Management

- [ ] `GET /agencies/{id}/` → load agency profile form
- [ ] `PATCH /agencies/{id}/` → save agency profile changes
- [ ] `POST /agencies/{id}/logo` → upload logo (replace FileReader preview with real upload)
- [ ] `GET/PATCH /agencies/{id}/markup` → connect markup config page
- [ ] `GET /agencies/{id}/users` → connect user list page

> **Field alignment needed:** frontend uses `rut`, backend uses `fiscal_id`. Align before integration.

### 1.4 Hotel Search

- [ ] Replace `MOCK_HOTELS` in `useHotels` with `GET /api/hotels?destination=&checkIn=&checkOut=...`
- [ ] Replace `MOCK_HOTEL_DETAIL` with `GET /api/hotels/{id}`
- [ ] Pass real search params (destination, dates, nationality, rooms) as query string
- [ ] Handle loading/empty/error states in results page

### 1.5 Booking Engine

- [ ] `POST /api/bookings` → connect checkout confirmation step
- [ ] `GET /api/bookings` → replace mock list in `useBookings`
- [ ] `GET /api/bookings/{id}` → booking detail / voucher modal
- [ ] `PATCH /api/bookings/{id}/cancel` → connect cancellation action

### 1.6 Wallet & Payments

- [ ] `GET /api/wallet` → real balance and credit limit in `useWallet`
- [ ] `GET /api/wallet/transactions` → real transaction history
- [ ] `POST /api/payments` → connect payment form on checkout

### 1.7 Admin Endpoints

- [ ] `GET/POST/PATCH/DELETE /api/admin/agencies` → connect agency CRUD in admin panel
- [ ] `POST /api/admin/agencies/{id}/approve` and `/block` → connect action buttons
- [ ] Agency groups CRUD → connect tier management page
- [ ] Support user CRUD → connect support user page
- [ ] `GET /api/admin/bookings` → global booking list view

### 1.8 Itinerary & Quoter Persistence

- [ ] `POST /api/itineraries` → save itinerary (connect `useItinerary.saveItinerary()`)
- [ ] `GET /api/itineraries` → list saved itineraries
- [ ] `GET/PUT/DELETE /api/itineraries/{id}` → load, edit, delete
- [ ] Same pattern for `useQuoter` → `/api/quotes`
- [ ] Shareable URL for itinerary/quote via unique token

---

## Phase 2 — Frontend Production Features

### 2.1 Error Handling

- [ ] Global error handler in `useApi` — map HTTP status codes to Spanish messages
- [ ] 401 → redirect to login and clear tokens
- [ ] 403 → "No tienes permiso para esta acción"
- [ ] 422/400 → map validation errors to form fields
- [ ] 500/network → toast with retry option
- [ ] Offline detection banner

### 2.2 PDF (Client-side)

The `print` layout and `*Document.vue` components are already built. Needed:

- [ ] Voucher PDF — call server-generated PDF endpoint or trigger client-side print
- [ ] Ensure `QuoterDocument.vue` and `ItineraryDocument.vue` render correctly in headless print
- [ ] Logo and custom agency color applied in PDF output

### 2.3 Form UX

- [ ] Form draft autosave on checkout (prevent data loss on back navigation)
- [ ] Dirty-state warnings on profile/markup forms before navigating away

### 2.4 Accessibility

- [ ] Keyboard navigation audit on modals and dropdowns
- [ ] ARIA labels on icon-only buttons
- [ ] Color contrast check on custom agency theme colors

---

## Phase 3 — Operational Improvements

### 3.1 Search & Export

- [ ] Server-side booking search (PNR, guest name, destination) — remove client-side filter from `useBookings`
- [ ] Export booking list to CSV (`GET /api/bookings/export.csv`)
- [ ] Saved search filters persisted per user

### 3.2 Notifications

- [ ] In-app notification center (booking updates, wallet alerts) — SSE or WebSocket
- [ ] Toast notifications for background events

### 3.3 Security

- [ ] Replace cookie role simulation with JWT-derived roles
- [ ] Ensure `X-CSRFToken` header is sent on all non-GET requests to Django
- [ ] Sanitize user-generated content before rendering (agency description, template fields)

### 3.4 Testing

- [ ] Unit tests for all composables (`useAuth`, `useBookings`, `useWallet`, `useAgency`)
- [ ] Component tests for checkout flow and markup calculator
- [ ] E2E tests for critical paths: login → search → book → view booking

---

## Phase 4 — Suggested Frontend Features

### 💡 Multi-Currency Display

Show net/sell prices in the agency's preferred currency. Pair with a backend exchange-rate endpoint.

### 💡 Availability Calendar

Calendar view on hotel detail page — price variation by date. Reduces back-and-forth.

### 💡 Client Portal

Read-only public route (`/booking/{token}`) for travelers to view their booking and download voucher without logging in.

### 💡 Advanced Analytics Dashboard

Real-time charts (Chart.js or D3) on admin dashboard — conversion rate, revenue trends, top destinations.

### 💡 Booking Modification Flow

Allow agencies to edit passenger names and room types post-booking. Currently only cancellation exists.

### 💡 B2C White-Label Mode

A configurable public-facing search/booking flow embeddable on agency websites. Reuse existing components with a different layout.

### 💡 Document Template Editor

Rich-text editor on the admin templates page to customize voucher/quote branding per agency.

### 💡 Two-Factor Authentication UI

TOTP setup flow for AGENCY_ADMIN and SUPER_ADMIN accounts.
