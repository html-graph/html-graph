import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should display canvas with virtual scroll", async ({ page }) => {
  test.setTimeout(10_000);
  await page.goto(`${e2eBase}/078-virtual-scroll/`);

  await page.getByTestId("start").click();

  await expect(page.getByTestId("loader")).toBeHidden();
  await expect(page).toHaveScreenshot("graph.png");
});
