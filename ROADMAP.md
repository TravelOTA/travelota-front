# Travelota Front — Development Roadmap

> This document tracks the current state of the platform, pending work, and recommended future features.

---

## Current State — What's Implemented

The application is a **fully polished UI prototype** with complete client-side flows backed by mock data. The `useApi()` wrapper is in place, so connecting composables to real backend endpoints is straightforward.

### ✅ Implemented (UI + Mock Data)

#### Authentication & Access Control
- Role-based access control via `travelota-role` cookie (USER, AGENCY_ADMIN, SUPPORT, SUPER_ADMIN)
- Auth middleware protecting all `/dashboard/**` routes
- Role-aware `DashboardNavbar` — nav items show/hide based on role
- Login and registration forms (UI + Zod validation)
- Magic login panel on landing page (dev/demo tool)

#### Hotel Search & Results
- Hotel search form with destination, dates, nationality, and room distribution
- Search params persisted in URL query string
- Results page with grid/list view
- Advanced filtering: price range, star category, meal regime, cancellation policy, on-request availability
- Hotel detail page with gallery, rooms, and price box
- Interactive Leaflet map with hotel pins

#### Quoter
- Add hotels to quote cart
- Per-item and global markup slider with real-time recalculation
- Profit margin visualization (net cost, markup, sell price)
- Quote preview modal
- `QuoterDocument.vue` print-ready component

#### Itinerary Builder
- Multiday block structure: hotel, flight, transfer, activity
- Up to 5 options per block with selection
- Adult/child pricing split (child = 50% of adult rate)
- Global markup applied to all blocks
- `ItineraryDocument.vue` print-ready component
- Print-to-PDF architecture via `localStorage` → `window.open('/print/itinerary')`

#### Checkout & Bookings
- Full checkout flow (reservation details, passenger form, cancellation policies, payment selector)
- Payment method selector: credit card, bank transfer, agency credit, pay later
- Agency credit availability check (`hasSufficientCredit()`)
- Booking confirmation page
- Booking list with filters: PNR, titular, destination, status, date range
- Client-side pagination (10 items/page)
- Mass booking selection and bulk payment UI
- Voucher preview modal

#### Wallet & Finance
- Credit limit display with usage percentage
- Transaction history (charge, payment, refund)
- `AgencyTransactions` and `WalletWidgets` components

#### Agency Management
- Agency profile editor (name, contact, address, logo)
- Logo upload with image preview (FileReader)
- Agency primary color picker with dynamic dashboard theming
- Markup configuration page
- Agency user list page

#### Admin Panel
- Admin dashboard with aggregate stats
- Agency CRUD (approve, block, edit)
- Agency group tier management (VIP, Mayorista, Estándar, Corpo)
- Support user CRUD
- Document/email template management page

#### UI Foundation
- Nuxt UI v4 component library (Reka UI + Tailwind v4)
- Custom green color palette via CSS `@theme static` tokens
- Dynamic hex-color theming per agency
- `print` layout for bare PDF rendering
- Fully responsive (mobile + desktop)
- Spanish UI language throughout

---

## Phase 1 — Backend Integration (Critical Path)

Connect the existing UI to a real backend. The `useApi()` composable already injects auth headers — composables only need their mock data replaced with `useApi<T>()` calls.

### 1.1 Authentication

- [ ] Real login endpoint — validate credentials, return JWT
- [ ] Real registration endpoint — create agency account with status `pending`
- [ ] JWT storage and refresh — replace cookie role simulation
- [ ] Logout — invalidate server-side session
- [ ] Password reset flow — email link + reset form
- [ ] Email verification on registration

### 1.2 Hotel Search

- [ ] Connect `useHotels` to real hotel inventory API or GDS/OTA provider
- [ ] Live availability check per search query
- [ ] Real-time pricing (net rates from supplier)
- [ ] Hotel detail endpoint — rooms, amenities, policies

### 1.3 Booking Engine

- [ ] `POST /api/bookings` — create booking, generate PNR
- [ ] `GET /api/bookings` — paginated booking list for agency
- [ ] `GET /api/bookings/:id` — booking detail
- [ ] `PATCH /api/bookings/:id` — cancel or modify booking
- [ ] Booking status lifecycle: Pending → Confirmed → Cancelled / Expired

### 1.4 Agency & User Management

- [ ] `GET/PUT /api/agency` — fetch and update agency profile
- [ ] `POST /api/agency/logo` — upload logo to cloud storage (S3/R2)
- [ ] `GET/POST/PUT/DELETE /api/agency/users` — manage agency users
- [ ] `GET/PUT /api/agency/markup` — markup configuration

### 1.5 Wallet & Payments

- [ ] `GET /api/wallet` — real balance and credit limit per agency
- [ ] `GET /api/wallet/transactions` — real transaction history
- [ ] `POST /api/payments` — charge payment method (credit card or bank transfer)
- [ ] Agency credit deduction on booking confirmation
- [ ] Payment gateway integration (Stripe or equivalent)

### 1.6 Admin Endpoints

- [ ] `GET/POST/PUT/DELETE /api/admin/agencies` — full agency CRUD
- [ ] `POST /api/admin/agencies/:id/approve` — approve pending registration
- [ ] `POST /api/admin/agencies/:id/block` — block agency
- [ ] `GET/POST/PUT/DELETE /api/admin/agency-groups` — tier management
- [ ] `GET/POST/PUT/DELETE /api/admin/support-users` — support user CRUD
- [ ] `GET /api/admin/bookings` — global booking view with cross-agency filters

### 1.7 Itinerary & Quoter Persistence

- [ ] `POST /api/itineraries` — save itinerary to database
- [ ] `GET /api/itineraries` — list saved itineraries
- [ ] `GET/PUT/DELETE /api/itineraries/:id` — load, update, delete
- [ ] `POST /api/quotes` — save quote
- [ ] `GET /api/quotes` — list saved quotes
- [ ] Share itinerary/quote via unique URL

---

## Phase 2 — Core Production Features

### 2.1 PDF & Document Generation

- [ ] Server-side PDF generation for vouchers (Puppeteer / WeasyPrint / wkhtmltopdf)
- [ ] Downloadable booking voucher PDF
- [ ] Downloadable itinerary PDF
- [ ] Downloadable quote PDF
- [ ] Invoice generation per booking or per settlement period

### 2.2 Email Notifications

- [ ] Booking confirmation email to agency and end customer
- [ ] Payment receipt email
- [ ] Booking cancellation email with policy details
- [ ] Agency registration approval email
- [ ] Payment reminder before deadline (pay-later bookings)
- [ ] Monthly settlement summary email

### 2.3 Real Markup & Pricing Rules

- [ ] Markup rules enforced server-side (prevent client-side tampering)
- [ ] Group-based markup floors/ceilings per agency tier
- [ ] Net rate vs sell rate audit log

### 2.4 Settlement & Billing

- [ ] Monthly settlement calculation per agency
- [ ] Settlement statement PDF
- [ ] Invoice generation for agency payments
- [ ] Payment reconciliation dashboard for admin

---

## Phase 3 — Operational Improvements

### 3.1 Notifications & Messaging

- [ ] In-app notification center (booking changes, wallet alerts)
- [ ] SMS notifications for booking confirmation and cancellation
- [ ] Admin broadcast messaging to all agencies
- [ ] Support ticket / chat between agency and operations team

### 3.2 Search & Filtering at Scale

- [ ] Server-side booking search with full-text (PNR, guest name, destination)
- [ ] Saved search filters per user
- [ ] Export booking list to CSV / Excel

### 3.3 Error Handling & Reliability

- [ ] Global API error boundary with user-friendly messages
- [ ] Retry logic for transient network errors in `useApi`
- [ ] Offline detection banner
- [ ] Form draft autosave (prevent data loss on navigation)

### 3.4 Security Hardening

- [ ] Replace cookie role simulation with signed JWT claims
- [ ] CSRF protection on all state-changing endpoints
- [ ] Rate limiting on login and registration endpoints
- [ ] Audit log for admin actions (agency block, user creation, etc.)
- [ ] GDPR-compliant data deletion for agency accounts

---

## Phase 4 — Suggested New Features

These features are not in the current codebase but would add significant value to the platform.

### 💡 Multi-Currency Support
Display net and sell prices in the agency's preferred currency with live exchange rates. Essential for agencies operating in multiple markets.

### 💡 Availability Calendar
A calendar view on the hotel detail page showing available dates and price variation. Reduces back-and-forth for agencies planning trips.

### 💡 Client Portal
A separate read-only portal where end customers (travelers) can view their booking details, download vouchers, and see itinerary status — without accessing the B2B dashboard.

### 💡 Advanced Analytics Dashboard
Replace the current static stats with real metrics: conversion rate (search → booking), average booking value per agency, top-selling destinations, monthly revenue trends. Use charts (e.g., Chart.js or D3).

### 💡 GDS / Channel Manager Integration
Connect to a real hotel inventory source (Amadeus, Sabre, Hotelbeds API, or similar) to replace mock hotel data with live availability and pricing.

### 💡 Markup Rules Engine
Allow admins to define complex markup rules: per destination, per hotel category, per date range, per agency group. Currently markup is a flat percentage with no rules.

### 💡 Booking Modification Flow
Allow agencies to modify passenger names, room types, or dates post-booking (subject to hotel policy). Currently there is no modification flow — only cancellation.

### 💡 Promotions & Deals Engine
Let the operations team publish time-limited promotions (early bird, last minute, contracted blocks). Agencies see highlighted deals in search results. The `usePromotions` composable is already stubbed.

### 💡 B2C White-Label Mode
A simplified public-facing version of the search and booking flow that agencies can embed on their own website under their branding. Reuses existing components with a different layout.

### 💡 Automated Payment Reminders
Proactive reminders for pay-later bookings approaching their payment deadline. Currently the deadline is displayed in the UI but there is no notification mechanism.

### 💡 Document Template Editor
Allow admins to customize the content and branding of vouchers, quotes, and itinerary PDFs per agency or globally. The `templates` admin page exists but has no editor.

### 💡 Two-Factor Authentication (2FA)
Optional TOTP-based 2FA for AGENCY_ADMIN and SUPER_ADMIN accounts. Critical for accounts with payment authorization and booking cancellation access.

### 💡 API Access for Agencies
A REST API key system allowing tech-savvy agencies to integrate travelota search and booking into their own systems or CRM.

---

## Summary

| Phase | Scope | Status |
|---|---|---|
| **Phase 0** | UI prototype with mock data | ✅ Complete |
| **Phase 1** | Backend integration (auth, booking engine, payments) | 🔲 Not started |
| **Phase 2** | PDF generation, email notifications, billing | 🔲 Not started |
| **Phase 3** | Operational improvements (search scale, error handling, security) | 🔲 Not started |
| **Phase 4** | New features (analytics, GDS, white-label, 2FA) | 🔲 Planned |
