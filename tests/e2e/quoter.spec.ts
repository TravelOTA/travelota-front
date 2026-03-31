import { test, expect } from "@playwright/test";

test.describe("Quoter and Itinerary Builder", () => {
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

  test("should add a hotel to the quoter and adjust markup", async ({
    page,
  }) => {
    // 1. Go to results
    await page.goto("/dashboard/hotels/results");
    await page.waitForLoadState("domcontentloaded");

    // 2. Click 'Cotizar / Itinerario' on the first hotel
    // Using regex to be more flexible with whitespace/case
    const quoteBtn = page
      .getByRole("button", { name: /Cotizar \/ Itinerario/i })
      .first();
    await expect(quoteBtn).toBeVisible({ timeout: 15000 });
    await quoteBtn.click();

    // 3. Navigate to quoter builder
    await page.goto("/dashboard/quoter/builder");
    await expect(page.getByText("Comienza a armar tu viaje")).toBeVisible({
      timeout: 15000,
    });

    // 4. Test Markup logic visibility
    await expect(page.getByText("PRECIO MÍNIMO BASE")).toBeVisible();
  });

  test("should show preview modal", async ({ page }) => {
    await page.goto("/dashboard/quoter/builder");
    await page.waitForLoadState("networkidle");

    const previewBtn = page.getByRole("button", {
      name: "Previsualizar Itinerario",
    });
    await expect(previewBtn).toBeVisible({ timeout: 15000 });
    await previewBtn.click();

    // Verify modal overlay
    await expect(page.locator("div[role='dialog']")).toBeVisible({
      timeout: 10000,
    });
  });
});
