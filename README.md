# travelota-front

> B2B travel agency platform — hotel search, quoter, itinerary builder, and agency management.

[![Nuxt](https://img.shields.io/badge/Nuxt-4.3-00DC82?logo=nuxt&labelColor=020420)](https://nuxt.com)
[![Nuxt UI](https://img.shields.io/badge/Nuxt%20UI-4.4-00DC82?logo=nuxt&labelColor=020420)](https://ui.nuxt.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.x-38bdf8?logo=tailwindcss&labelColor=0f172a)](https://tailwindcss.com)
[![Vitest](https://img.shields.io/badge/Vitest-4.x-6e9f18?logo=vitest&labelColor=1a1a1a)](https://vitest.dev)
[![pnpm](https://img.shields.io/badge/pnpm-10.x-f69220?logo=pnpm&labelColor=1a1a1a)](https://pnpm.io)

---

## Tech Stack

| Technology                     | Version | Purpose                                       |
| ------------------------------ | ------- | --------------------------------------------- |
| **Nuxt**                       | 4.3.x   | Full-stack framework, file-based routing, SSR |
| **Vue**                        | 3.5.x   | Reactive component framework                  |
| **@nuxt/ui**                   | 4.4.x   | Component library (Reka UI + Tailwind)        |
| **Tailwind CSS**               | 4.x     | Utility-first CSS                             |
| **Zod**                        | 4.x     | TypeScript-first schema validation            |
| **Vitest**                     | 4.x     | Unit/component testing                        |
| **@vue/test-utils**            | 2.x     | Vue component test utilities                  |
| **happy-dom**                  | 20.x    | Lightweight DOM environment for tests         |
| **Leaflet** + **@vue-leaflet** | 1.9.x   | Interactive hotel maps                        |
| **motion-v**                   | 2.x     | Animations (Vue Motion)                       |
| **date-fns**                   | 4.x     | Date manipulation                             |
| **@vuepic/vue-datepicker**     | 12.x    | Date picker component                         |
| **html-to-image**              | 1.x     | HTML → image for PDF generation               |
| **Husky** + **lint-staged**    | —       | Pre-commit hooks (ESLint + Prettier)          |

---

## Requirements & Setup

**Node.js 20+** and **pnpm 10+** required.

```bash
pnpm install
pnpm dev        # Dev server at http://localhost:3000
```

### Environment Variables

| Variable                   | Description          | Default                               |
| -------------------------- | -------------------- | ------------------------------------- |
| `NUXT_PUBLIC_API_BASE_URL` | Backend API base URL | `""` (empty — uses mock server route) |

---

## Available Commands

| Command              | Description                                         |
| -------------------- | --------------------------------------------------- |
| `pnpm dev`           | Start development server at `http://localhost:3000` |
| `pnpm build`         | Production build                                    |
| `pnpm preview`       | Preview production build locally                    |
| `pnpm lint`          | ESLint check                                        |
| `pnpm lint:fix`      | ESLint auto-fix                                     |
| `pnpm typecheck`     | TypeScript check via `nuxt typecheck`               |
| `pnpm format`        | Prettier check                                      |
| `pnpm format:fix`    | Prettier auto-fix                                   |
| `pnpm test`          | Vitest in watch mode (development)                  |
| `pnpm test:run`      | Vitest single run (CI)                              |
| `pnpm test:coverage` | Vitest with HTML coverage report                    |

---

## Directory Architecture

All application code lives under `app/` (Nuxt 4 convention).

```
travelota-front/
├── app/
│   ├── app.vue                   # Root: UApp > NuxtLayout > NuxtPage
│   ├── app.config.ts             # Nuxt UI theme (primary: green, neutral: slate)
│   ├── assets/css/main.css       # Tailwind v4 imports + custom green color tokens
│   ├── layouts/
│   │   ├── default.vue           # Public pages (header + footer)
│   │   ├── dashboard.vue         # Authenticated B2B (role-aware navbar + AddToItineraryModal)
│   │   └── print.vue             # Bare layout for browser PDF generation
│   ├── pages/                    # File-based routing (see Routing section)
│   ├── components/
│   │   ├── AppFooter.vue
│   │   ├── AppLogo.vue
│   │   ├── DashboardNavbar.vue   # Role-aware B2B navigation
│   │   ├── auth/                 # LoginForm, RegisterForm
│   │   ├── landing/              # Public landing sections
│   │   └── b2b/
│   │       ├── hotel/            # Search form, results, detail, checkout components
│   │       ├── quoter/           # Quoter builder, ItineraryDocument, QuoterDocument
│   │       └── finance/          # WalletWidgets, AgencyTransactions
│   ├── composables/              # 15 reactive state composables (see State Management)
│   ├── middleware/
│   │   └── auth.global.ts        # Global auth middleware
│   └── utils/
│       ├── schemas.ts            # Zod validation schemas
│       └── formatDate.ts         # Date formatting utilities
├── server/
│   └── api/
│       └── agency.get.ts         # Mock agency endpoint (replace with real backend)
├── tests/
│   ├── setup.ts                  # Global Vitest setup
│   ├── __mocks__/
│   │   ├── imports.ts            # Nuxt #imports stubs (useState, useRouter, etc.)
│   │   └── app.ts                # #app stub
│   ├── composables/              # useHotelSearch, useHotels, useQuoter tests
│   ├── components/               # RoomDistribution, SearchSummaryBar tests
│   └── utils/                    # formatDate tests
├── nuxt.config.ts
├── vitest.config.ts
├── eslint.config.mjs
├── Dockerfile
└── CLAUDE.md                     # AI assistant instructions
```

---

## Layouts

| Layout      | File                        | Used by                                                        |
| ----------- | --------------------------- | -------------------------------------------------------------- |
| `default`   | `app/layouts/default.vue`   | Public pages: `/`, `/register`, `/about`, `/privacy`, `/terms` |
| `dashboard` | `app/layouts/dashboard.vue` | All `/dashboard/**` routes — authenticated B2B area            |
| `print`     | `app/layouts/print.vue`     | `/print/**` routes — bare HTML for `window.print()`            |

---

## Routing

| Route                            | File                                            | Required Role                       |
| -------------------------------- | ----------------------------------------------- | ----------------------------------- |
| `/`                              | `pages/index.vue`                               | Public                              |
| `/register`                      | `pages/register.vue`                            | Public                              |
| `/about`, `/privacy`, `/terms`   | `pages/about.vue`, etc.                         | Public                              |
| `/dashboard`                     | `pages/dashboard/index.vue`                     | Any authenticated                   |
| `/dashboard/hotels/results`      | `pages/dashboard/hotels/results.vue`            | Any authenticated                   |
| `/dashboard/hotels/:id`          | `pages/dashboard/hotels/[id].vue`               | Any authenticated                   |
| `/dashboard/hotels/checkout`     | `pages/dashboard/hotels/checkout.vue`           | Any authenticated                   |
| `/dashboard/hotels/booking/:id`  | `pages/dashboard/hotels/booking/[id].vue`       | Any authenticated                   |
| `/dashboard/bookings`            | `pages/dashboard/bookings/index.vue`            | Any authenticated                   |
| `/dashboard/quoter`              | `pages/dashboard/quoter/index.vue`              | Any authenticated                   |
| `/dashboard/quoter/builder`      | `pages/dashboard/quoter/builder.vue`            | Any authenticated                   |
| `/dashboard/agency`              | `pages/dashboard/agency/index.vue`              | `AGENCY_ADMIN`+                     |
| `/dashboard/agency/markup`       | `pages/dashboard/agency/markup.vue`             | `AGENCY_ADMIN`+                     |
| `/dashboard/agency/users`        | `pages/dashboard/agency/users.vue`              | `AGENCY_ADMIN`+                     |
| `/dashboard/admin`               | `pages/dashboard/admin/index.vue`               | `SUPPORT` / `SUPER_ADMIN`           |
| `/dashboard/admin/bookings`      | `pages/dashboard/admin/bookings.vue`            | `SUPPORT` / `SUPER_ADMIN`           |
| `/dashboard/admin/agencies`      | `pages/dashboard/admin/agencies/index.vue`      | `SUPER_ADMIN`                       |
| `/dashboard/admin/agencies/:id`  | `pages/dashboard/admin/agencies/[id].vue`       | `SUPER_ADMIN`                       |
| `/dashboard/admin/agency-groups` | `pages/dashboard/admin/agency-groups/index.vue` | `SUPER_ADMIN`                       |
| `/dashboard/admin/support-users` | `pages/dashboard/admin/support-users.vue`       | `SUPER_ADMIN`                       |
| `/dashboard/admin/templates`     | `pages/dashboard/admin/templates/index.vue`     | `SUPER_ADMIN`                       |
| `/print/itinerary`               | `pages/print/itinerary.vue`                     | Internal (opened via `window.open`) |
| `/print/quoter`                  | `pages/print/quoter.vue`                        | Internal (opened via `window.open`) |

---

## Global State (Composables)

No Pinia. All state is managed via **Nuxt `useState`** (SSR-safe singletons). Composables live in `app/composables/`.

| Composable        | Purpose                                                          | Key returns                                                     |
| ----------------- | ---------------------------------------------------------------- | --------------------------------------------------------------- |
| `useAuth`         | Role via `travelota-role` cookie                                 | `role`, `loginAs(role)`, `logout()`                             |
| `useApi`          | Centralized `useFetch` wrapper with auth header injection        | `useApi<T>(path, opts)`                                         |
| `useAgency`       | Logged-in agency profile (fetches `/api/agency`)                 | `agency`, `refresh()`, `updateAgency(data)`                     |
| `useAgencies`     | Admin CRUD for all agencies                                      | `agencies`, `create()`, `update()`, `delete()`                  |
| `useAgencyGroups` | Agency group tiers (markup config)                               | `groups`, `updateGroup(id, data)`                               |
| `useBookings`     | Booking list + filter/search state                               | `bookings`, `filters`, `resetFilters()`                         |
| `useConfig`       | Static reference data (countries, destinations, payment methods) | `countries`, `destinations`, `paymentMethods`                   |
| `useHotelSearch`  | Hotel search form params                                         | `searchParams`, `search()`                                      |
| `useHotels`       | Hotel results list + filter state                                | `hotels`, `filters`, `updateFilters()`                          |
| `useItinerary`    | Multiday itinerary builder (blocks, options, pricing)            | `itinerary`, `addBlock()`, `updateBlock()`, `calculateTotals()` |
| `useQuoter`       | Quote cart (hotel items, global markup, totals)                  | `items`, `globalMarkupPercentage`, `addItem()`, `removeItem()`  |
| `useWallet`       | Credit limit, balance, transactions                              | `wallet`, `transactions`                                        |
| `useStats`        | Dashboard stats derived from other composables                   | `adminStats`, `supportStats`                                    |
| `usePromotions`   | Promotional card data                                            | `promotions`                                                    |
| `useSupportUsers` | Support/admin user CRUD                                          | `users`, `stats`, `create()`, `update()`                        |

> **Pattern:** `useState("key", () => defaultValue)` creates an SSR-safe reactive singleton. Each test gets isolated state since mocks don't share keys.

---

## Role System

Authentication is simulated via a cookie (`travelota-role`). Roles control navigation visibility in `DashboardNavbar.vue` and are enforced in middleware.

| Role           | Access                                                        |
| -------------- | ------------------------------------------------------------- |
| `USER`         | Hotels, Quoter, Bookings                                      |
| `AGENCY_ADMIN` | + Agency profile, markup configuration, user management       |
| `SUPPORT`      | Admin booking management + full B2B view                      |
| `SUPER_ADMIN`  | Full admin: agencies, agency groups, support users, templates |

> The landing page (`/`) includes a magic login UI that sets the role cookie — for development/demo purposes only.

---

## Pricing Logic

### Markup

```
sellPrice = netPrice × (1 + markupPercentage / 100)
```

Markup is stored per-item in `useQuoter` and globally in `useItinerary`.

### Pax Split (adults + children at 0.5×)

```
adultRate = total / (adults + children × 0.5)
childRate  = adultRate × 0.5
```

---

## PDF / Print Architecture

Print pages use a bare `print` layout with no header/footer chrome, optimized for `window.print()`.

```
1. User triggers modal (ItineraryPreviewModal / QuoterPreviewModal)
2. Modal serializes composable state → localStorage
3. window.open('/print/itinerary', '_blank')
4. Print page reads localStorage, hydrates document component
5. window.print() called on mount
```

Document components: `ItineraryDocument.vue`, `QuoterDocument.vue` (in `app/components/b2b/quoter/`).

---

## Validation (Zod)

All schemas are in [`app/utils/schemas.ts`](app/utils/schemas.ts). Error messages are in Spanish.

| Schema            | Used by                            |
| ----------------- | ---------------------------------- |
| `loginSchema`     | Login form                         |
| `registerSchema`  | Agency registration form           |
| `agencySchema`    | Agency profile data (API response) |
| `itinerarySchema` | Itinerary builder payload          |

Types are exported via `z.infer<typeof schema>` (e.g. `LoginInput`, `RegisterInput`, `Agency`, `ItineraryPayload`).

---

## Testing

**Stack:** Vitest v4 + `@vue/test-utils` + `happy-dom`

```
tests/
├── setup.ts               # Global setup (suppresses Vue warnings)
├── __mocks__/
│   ├── imports.ts         # Stubs for Nuxt #imports (useState, useRouter, useRoute…)
│   └── app.ts             # Stub for #app
├── composables/           # useHotelSearch, useHotels, useQuoter
├── components/            # RoomDistribution, SearchSummaryBar
└── utils/                 # formatDate
```

### Mock Conventions

```ts
// Mock Nuxt composables
vi.mock("#imports", () => ({
  useState: (key, init) => ref(init()), // Isolated per test (no shared key)
  useRouter: () => ({ push: vi.fn() }),
  // ...
}));
```

- `useState` is mocked as `ref(init())` without shared keys — each test gets isolated state
- Override `useRouter` in tests that verify navigation

### Coverage

Coverage is collected for `app/composables/**` and `app/utils/**` only. Reports generated as HTML in `coverage/`.

```bash
pnpm test:coverage    # generates coverage/index.html
```

---

## Code Conventions

### Component Style

- Always `<script setup lang="ts">` — Composition API only
- Component order: imports → props/emits → reactive state → computed → functions
- Explicit imports preferred over Nuxt auto-imports

### File Naming

| Type               | Convention                                   | Example                  |
| ------------------ | -------------------------------------------- | ------------------------ |
| Components         | `PascalCase.vue`                             | `HotelResultCard.vue`    |
| Pages              | `kebab-case.vue`                             | `hotel-detail.vue`       |
| Dynamic routes     | `[param].vue`                                | `[id].vue`               |
| Component prefixes | `Hotel*`, `Result*`, `Checkout*`, `Booking*` | `CheckoutPassengers.vue` |

### Formatting

| Tool                 | Config                                       |
| -------------------- | -------------------------------------------- |
| **Prettier**         | `singleQuote: true`, `semi: true`            |
| **ESLint stylistic** | `commaDangle: "never"`, `braceStyle: "1tbs"` |

Pre-commit hooks (Husky + lint-staged) run ESLint + Prettier automatically on `*.{js,ts,vue}` files.

### UI Language

i18n is a **MVP requirement**. All UI strings must go through the i18n system — do not hardcode text directly in templates or components. Default language is Spanish.

---

## Server API

Currently a single mock endpoint:

| Method | Path          | File                       | Description                   |
| ------ | ------------- | -------------------------- | ----------------------------- |
| `GET`  | `/api/agency` | `server/api/agency.get.ts` | Returns logged-in agency data |

The endpoint returns mock data. Replace the handler body with a real database or backend call when the API is ready. All composables should route external requests through `useApi<T>(path)` to ensure auth headers are injected automatically.

---

## Dynamic Theming

`dashboard.vue` supports custom hex primary colors per agency. When `appConfig.ui.colors.primary` starts with `#`, it injects CSS custom properties (`--ui-color-primary-*`) using `color-mix()`. Named Tailwind colors use Nuxt UI defaults.

---

## Docker

A `Dockerfile` is included for containerized deployments. Build and run:

```bash
docker build -t travelota-front .
docker run -p 3000:3000 travelota-front
```
