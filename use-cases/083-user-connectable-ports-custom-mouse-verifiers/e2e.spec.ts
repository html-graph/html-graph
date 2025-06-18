import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should have initial state when no space pressed", async ({ page }) => {
  await page.goto(
    `${e2eBase}/083-user-connectable-ports-custom-mouse-verifiers/`,
  );
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(250, 400);
  await page.mouse.down();
  await page.mouse.move(450, 500);
  await page.mouse.up();

  await expect(page).toHaveScreenshot("initial.png");
});

test("should create create connection when space pressed", async ({ page }) => {
  await page.goto(
    `${e2eBase}/083-user-connectable-ports-custom-mouse-verifiers/`,
  );
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(250, 400);
  await page.keyboard.down("Space");
  await page.mouse.down();
  await page.mouse.move(450, 500);
  await page.mouse.up();

  await expect(page).toHaveScreenshot("after-edge-added.png");
});
