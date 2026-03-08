# Design: Role-Based Magic Login

## Overview
Transform the current static login form in `app/pages/index.vue` into a functional role-based testing component. This will allow the user to easily simulate different roles (User, Agency Admin, Support, Super Admin) when navigating the dashboard without needing a real backend auth provider yet.

## User Flow
1. User lands on `/` (Login page).
2. Below the main "Entrar" button, 4 "Magic Login" buttons will be presented representing the 4 system roles.
3. Clicking a magic button will:
   - Auto-fill the email and password fields for visual feedback.
   - Use Nuxt `useCookie` or `useState` to store the active `userRole` session.
   - Redirect the user to `/dashboard`.
4. The dashboard layout (`app/layouts/dashboard.vue`) will read this stored role instead of the current hardcoded `ref("SUPER_ADMIN")` to dynamically render the correct navigation links.

## Technical Architecture

### 1. State Management (Auth Simulation)
We will create a composable `app/composables/useAuth.ts` (or expand if it exists) to handle the mock session.
- Store the standard session role: `const userRole = useCookie<string>('travelota-role', { default: () => 'USER' })`
- Expose a `loginAs(role)` method.

### 2. Login Component (`index.vue`)
Add the 4 Magic Buttons below the main form using NuxtUI components:
- User (`USER`)
- Admin de Agencia (`AGENCY_ADMIN`)
- Soporte (`SUPPORT`)
- Super Admin (`SUPER_ADMIN`)

When clicked, the `handleLogin` function will be triggered with the specific mock credentials and trigger the router push.

### 3. Dashboard Layout (`dashboard.vue`)
- Replace the hardcoded `const userRole = ref("SUPER_ADMIN");` with the reactive cookie from `useAuth`.
- The existing navigation logic (`userLinks` computed property) will automatically react and hide/show menus based on this cookie.

## Trade-offs
- **Security:** This is purely a frontend-mocked authentication approach. It is entirely insecure and meant exclusively for UI routing and presentation testing.
- **Persistence:** By using Nuxt `useCookie`, the simulated session will survive page reloads, making it ideal for testing multi-page flows.
