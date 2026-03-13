# Dashboard Structural Analysis & Improvements

The objective is to standardize the project's layout structure and improve the user experience of the B2B dashboard.

## Proposed Changes

### [Shared Components]

#### [NEW] [AppFooter.vue](file:///Users/ferrera/Git/travelota-front/app/components/AppFooter.vue)
- Extract the footer logic from `default.vue` into a reusable component.

#### [NEW] [DashboardNavbar.vue](file:///Users/ferrera/Git/travelota-front/app/components/DashboardNavbar.vue)
- Extract the complex header/nav logic from `dashboard.vue`.

### [Layouts]

#### [MODIFY] [default.vue](file:///Users/ferrera/Git/travelota-front/app/layouts/default.vue)
- Replace hardcoded footer with `<AppFooter />`.

#### [MODIFY] [dashboard.vue](file:///Users/ferrera/Git/travelota-front/app/layouts/dashboard.vue)
- Use `<DashboardNavbar />` and add `<AppFooter />`.
- Standardize the main container structure.

### [Dashboard Enhancements]

#### [MODIFY] [index.vue](file:///Users/ferrera/Git/travelota-front/app/pages/dashboard/index.vue)
- Add a "Quick Stats" row (simulated for now) using `UCard`.
- Improve the visual hierarchy of the search section.

---

## Verification Plan

### Automated Tests
- `pnpm lint`: Verify no stylistic errors.
- `pnpm typecheck`: Ensure all components use correct props.

### Manual Verification
- Check that the footer appears on both Landing and Dashboard pages.
- Verify that navigation still works correctly in the dashboard.
- Ensure the dashboard index page feels more "premium" and informative.
