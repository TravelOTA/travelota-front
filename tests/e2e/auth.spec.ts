import { test, expect } from "@playwright/test";

test.describe("Authentication Flows", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should login as Regular User (Agent)", async ({ page }) => {
    await page.getByRole("button", { name: "Admin Agencia" }).click(); // 'Admin Agencia' is actually the button text for that role in the login form
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByText("Buscar Hoteles")).toBeVisible();
    await expect(page.getByText("Agencia Demo")).toBeVisible();
  });

  test("should login as Super Admin", async ({ page }) => {
    await page.getByRole("button", { name: "Super Admin" }).click();
    await expect(page).toHaveURL(/.*dashboard/);
    // Check for super admin specific links
    await page.goto("/dashboard/admin/agencies");
    await expect(page.getByText("Administración de Agencias")).toBeVisible();
  });

  test("should logout correctly", async ({ page }) => {
    await page.getByRole("button", { name: "Super Admin" }).click();
    await expect(page).toHaveURL(/.*dashboard/);

    // Trigger logout (assuming there's a logout button/icon)
    // Looking at the dashboard screenshot, there's a logout icon in the top right
    await page
      .locator("button.text-red-500")
      .or(page.locator("i-heroicons-arrow-right-on-rectangle"))
      .click();
    await expect(page).toHaveURL("/");
  });
});
