import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should display canvas with virtual scroll nodes dynamic content", async ({
  page,
}) => {
  await page.goto(`${e2eBase}/094-virtual-scroll-events/`);
  await expect(page).toHaveScreenshot("initial.png");
});
