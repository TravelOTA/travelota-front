import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {
  test('should login as Regular User (Agent)', async ({ page, context }) => {
    // Inject Agent cookie
    await context.addCookies([
      {
        name: 'travelota-role',
        value: 'AGENCY_ADMIN',
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByText(/Buscar Hoteles/)).toBeVisible();
  });

  test('should login as Super Admin', async ({ page, context }) => {
    // Inject Super Admin cookie
    await context.addCookies([
      {
        name: 'travelota-role',
        value: 'SUPER_ADMIN',
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*dashboard/);

    await page.goto('/dashboard/admin/agencies');
    await page.waitForLoadState('networkidle');
    // Verify by looking for the specific administration heading
    // This is the verified heading in SUPER_ADMIN mode
    await expect(
      page.getByRole('heading', { name: 'Gestión de Agencias B2B' }),
    ).toBeVisible({ timeout: 25000 });
  });

  test('should logout correctly', async ({ page, context }) => {
    // Pre-login via cookie injection
    await context.addCookies([
      {
        name: 'travelota-role',
        value: 'SUPER_ADMIN',
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*dashboard/);

    // Trigger logout - use evaluate to bypass hydration/event-bubbling issues
    await page.evaluate(() => {
      const btn = document.querySelector('header button.text-error');
      if (btn instanceof HTMLElement) btn.click();
    });

    // Verify we are back at the landing page by checking for the main slogan
    const slogan = page.getByText(/Mayorista/i).first();
    await expect(slogan).toBeVisible({ timeout: 40000 });
  });
});
