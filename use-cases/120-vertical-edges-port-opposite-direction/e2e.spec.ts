import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should have reverse horizontal edges", async ({ page }) => {
  await page.goto(`${e2eBase}/120-vertical-edges-port-opposite-direction/`);

  await expect(page).toHaveScreenshot("initial.png");
});
