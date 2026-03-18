import { test, expect } from "@playwright/test";

test.describe("Hotel Search and Results", () => {
  test.beforeEach(async ({ page, context }) => {
    // Inject Agent cookie
    await context.addCookies([
      {
        name: "travelota-role",
        value: "AGENCY_ADMIN",
        domain: "localhost",
        path: "/",
      },
    ]);

    await page.goto("/dashboard");
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test("should perform a successful hotel search", async ({ page }) => {
    // Fill Destination using USelectMenu (it's a button trigger)
    const destTrigger = page
      .locator('button:has-text("¿A dónde vas?")')
      .first();
    await expect(destTrigger).toBeVisible({ timeout: 15000 });
    await destTrigger.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000); // Hydration wait
    await destTrigger.click();

    // Once clicked, the search input inside the popover should appear
    const searchInput = page.locator('input[placeholder*="Search"]').first();
    await expect(searchInput).toBeVisible({ timeout: 15000 });
    await searchInput.clear();
    await searchInput.type("Punta Cana", { delay: 100 });
    await page.waitForTimeout(1000);
    await page.keyboard.press("Enter");

    // Final check for the selection
    await page.waitForTimeout(500);
    await page.keyboard.press("Enter");

    // Click Search button
    const searchBtn = page.getByRole("button", { name: "Buscar" });
    await searchBtn.click();

    // Verify Results page
    await expect(page).toHaveURL(/.*results/, { timeout: 15000 });

    // Wait for the results count to be visible (ensures hydration)
    await expect(page.locator("span.font-bold").first()).toBeVisible({
      timeout: 15000,
    });

    // Check if at least some results are visible (using mock hotels)
    const IberostarCard = page.getByText(/Iberostar/i).first();
    await expect(IberostarCard).toBeVisible({ timeout: 20000 });
  });

  test("should filter results by hotel name", async ({ page }) => {
    await page.goto("/dashboard/hotels/results");
    await page.waitForLoadState("domcontentloaded");

    // Find the name filter input in the sidebar
    const nameFilter = page.getByPlaceholder("Nombre de hotel");
    await expect(nameFilter).toBeVisible({ timeout: 15000 });
    await nameFilter.fill("Iberostar");

    // Verify filtered results
    await expect(page.getByText("Iberostar WAVES DOMINICANA")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText("Serenade Punta Cana")).not.toBeVisible();
  });

  test("should navigate to hotel detail", async ({ page }) => {
    await page.goto("/dashboard/hotels/results");
    await page.waitForLoadState("domcontentloaded");

    // Click on a hotel name to go to detail
    // Use a link locator or a very specific text match
    const hotelLink = page.getByRole("heading", { name: /Serenade/i }).first();
    await expect(hotelLink).toBeVisible({ timeout: 15000 });
    await hotelLink.click();

    await expect(page).toHaveURL(/\/dashboard\/hotels\/\d+/, {
      timeout: 20000,
    });
    await page.waitForLoadState("networkidle");
    await expect(
      page.getByRole("heading", { name: /Serenade/i }).first(),
    ).toBeVisible({ timeout: 15000 });
  });
});
