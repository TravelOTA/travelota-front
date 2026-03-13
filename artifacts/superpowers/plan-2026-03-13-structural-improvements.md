# Dashboard Structural Improvements & Promotions

The objective is to standardize the project's layout structure, add the missing footer, and implement an admin-configurable Promotions system that is safe to show to end clients.

## Proposed Changes

### [Shared Components]

#### [NEW] [AppFooter.vue](file:///Users/ferrera/Git/travelota-front/app/components/AppFooter.vue) [NEW]
- Extract the footer logic from `default.vue` into a reusable component.

#### [NEW] [DashboardNavbar.vue](file:///Users/ferrera/Git/travelota-front/app/components/DashboardNavbar.vue) [NEW]
- Extract the complex header/nav logic from `dashboard.vue`.

#### [NEW] [PromotionCard.vue](file:///Users/ferrera/Git/travelota-front/app/components/b2b/landing/PromotionCard.vue) [NEW]
- A premium card component for destinations/hotels that triggers a search when clicked.

### [Layouts]

#### [MODIFY] [default.vue](file:///Users/ferrera/Git/travelota-front/app/layouts/default.vue)
- Replace hardcoded footer with `<AppFooter />`.

#### [MODIFY] [dashboard.vue](file:///Users/ferrera/Git/travelota-front/app/layouts/dashboard.vue)
- Use `<DashboardNavbar />` and add `<AppFooter />` at the bottom.

### [Data & Logic]

#### [NEW] [usePromotions.ts](file:///Users/ferrera/Git/travelota-front/app/composables/usePromotions.ts) [NEW]
- A composable to fetch active promotions. It will mock data that "Super Admin" would configure.

### [Dashboard Page]

#### [MODIFY] [index.vue](file:///Users/ferrera/Git/travelota-front/app/pages/dashboard/index.vue)
- Remove hardcoded "Ofertas" cards.
- Integrate `<PromotionCard />` listing driven by `usePromotions`.
- Ensure no sensitive commission/revenue data is shown by default.

---

## Verification Plan

### Automated Tests
- `pnpm lint`: Verify no stylistic errors.
- `pnpm typecheck`: Ensure all components use correct props.

### Manual Verification
- Check that the footer appears on both Landing and Dashboard pages.
- Verify that navigation still works correctly in the dashboard.
- Ensure the dashboard index page feels more "premium" and informative.
