import { test, expect } from '@playwright/test';

test.describe('Administrative Management', () => {
  test.beforeEach(async ({ page, context }) => {
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
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should view global agencies list', async ({ page }) => {
    await page.goto('/dashboard/admin/agencies');
    await page.waitForLoadState('domcontentloaded');
    await expect(
      page.getByRole('heading', { name: 'Gestión de Agencias B2B' }),
    ).toBeVisible({ timeout: 15000 });

    // Verify table content (mock agencies)
    await expect(page.getByText(/Agencia Demo/).first()).toBeVisible();
    await expect(
      page.getByText(/Viajes El Corte Inglés/).first(),
    ).toBeVisible();
  });

  test('should navigate to agency groups', async ({ page }) => {
    await page.goto('/dashboard/admin/agency-groups');
    await expect(page.getByText('Grupos de Agencia')).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByText('Grupo VIP')).toBeVisible();
  });

  test('should view support users', async ({ page }) => {
    await page.goto('/dashboard/admin/support-users');
    await expect(page.getByText('Usuarios de Soporte')).toBeVisible({
      timeout: 15000,
    });
  });

  test('should check agency-specific settings (Agency Admin flow)', async ({
    page,
    context,
  }) => {
    // Switch to Agency Admin via cookie injection
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

    await page.goto('/dashboard/agency');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByText(/Mi Agencia/).first()).toBeVisible({
      timeout: 15000,
    });

    await page.goto('/dashboard/agency/users');
    await expect(page.getByText(/Equipo de Ventas/).first()).toBeVisible();
  });
});
