import { test, expect } from "@playwright/test";

test.describe("Administrative Management", () => {
  test.beforeEach(async ({ page }) => {
    // Login as Super Admin
    await page.goto("/");
    await page.getByRole("button", { name: "Super Admin" }).click();
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test("should view global agencies list", async ({ page }) => {
    await page.goto("/dashboard/admin/agencies");
    await expect(
      page.getByRole("heading", { name: "Administración de Agencias" }),
    ).toBeVisible();

    // Verify table content (mock agencies)
    await expect(page.getByText("Agencia Demo")).toBeVisible();
    await expect(page.getByText("Viajes Premium")).toBeVisible();
  });

  test("should navigate to agency groups", async ({ page }) => {
    await page.goto("/dashboard/admin/agency-groups");
    await expect(page.getByText("Grupos de Agencia")).toBeVisible();
    await expect(page.getByText("Grupo VIP")).toBeVisible();
  });

  test("should view support users", async ({ page }) => {
    await page.goto("/dashboard/admin/support-users");
    await expect(page.getByText("Usuarios de Soporte")).toBeVisible();
  });

  test("should check agency-specific settings (Agency Admin flow)", async ({
    page,
  }) => {
    // Switch to Agency Admin (logout and re-login or use direct nav if middleware allows)
    await page.goto("/");
    await page.getByRole("button", { name: "Admin Agencia" }).click();

    await page.goto("/dashboard/agency");
    await expect(page.getByText("Perfil de la Agencia")).toBeVisible();

    await page.goto("/dashboard/agency/users");
    await expect(page.getByText("Gestión de Usuarios")).toBeVisible();
  });
});
