import { test, expect } from "@playwright/test";

test.describe("Hotel Search and Results", () => {
  test.beforeEach(async ({ page }) => {
    // Login as Agent
    await page.goto("/");
    await page.getByRole("button", { name: "Admin Agencia" }).click();
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test("should perform a successful hotel search", async ({ page }) => {
    // Fill Destination using USelectMenu
    const destInput = page.getByPlaceholder("¿A dónde vas?");
    await destInput.click();
    await destInput.fill("Punta Cana");
    await page.keyboard.press("Enter");

    // Click Search button
    await page.getByRole("button", { name: "Buscar" }).click();

    // Verify Results page
    await expect(page).toHaveURL(/.*results/);

    // Check if at least some results are visible (using mock hotels)
    const resultsCountText = page.locator("span.font-bold").first();
    await expect(resultsCountText).not.toHaveText("0");

    // Verify a specific mock hotel appears
    await expect(page.getByText("Serenade Punta Cana")).toBeVisible();
  });

  test("should filter results by hotel name", async ({ page }) => {
    await page.goto("/dashboard/hotels/results");

    // Find the name filter input in the sidebar
    const nameFilter = page.getByPlaceholder("Buscar por nombre...");
    await nameFilter.fill("Iberostar");

    // Verify filtered results
    await expect(page.getByText("Iberostar WAVES DOMINICANA")).toBeVisible();
    await expect(page.getByText("Serenade Punta Cana")).not.toBeVisible();
  });

  test("should navigate to hotel detail", async ({ page }) => {
    await page.goto("/dashboard/hotels/results");

    // Click on a hotel name to go to detail
    await page.getByText("Serenade Punta Cana").first().click();

    await expect(page).toHaveURL(/\/dashboard\/hotels\/\w+/);
    await expect(
      page.getByRole("heading", { name: "Serenade Punta Cana" }),
    ).toBeVisible();
  });
});
