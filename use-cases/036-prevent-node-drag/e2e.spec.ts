import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should not drag first node", async ({ page }) => {
  await page.goto(`${e2eBase}/036-prevent-node-drag/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(170, 390);
  await page.mouse.down();
  await page.mouse.move(500, 350);

  await expect(page).toHaveScreenshot("initial.png");
});

test("should drag second node", async ({ page }) => {
  await page.goto(`${e2eBase}/036-prevent-node-drag/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(500, 500);
  await page.mouse.down();
  await page.mouse.move(600, 600);

  await expect(page).toHaveScreenshot("after-drag.png");
});
