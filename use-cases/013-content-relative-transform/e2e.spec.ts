import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should apply content transform", async ({ page }) => {
  await page.goto(`${e2eBase}/013-content-relative-transform/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.locator("#scale").fill("1.5");

  await expect(page).toHaveScreenshot("after-scale.png");

  await page.locator("#delta-x").fill("-500");

  await expect(page).toHaveScreenshot("after-delta-x.png");

  await page.locator("#delta-y").fill("200");

  await expect(page).toHaveScreenshot("after-delta-y.png");
});
