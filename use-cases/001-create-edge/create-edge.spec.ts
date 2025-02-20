import { test, expect } from "@playwright/test";

test("should create nodes and edges", async ({ page }) => {
  await page.goto("http://localhost:3100/use-cases/001-create-edge/");
  await expect(page).toHaveScreenshot();
});

// test("get started link", async ({ page }) => {
//   await page.goto("https://playwright.dev/");

//   // Click the get started link.
//   await page.getByRole("link", { name: "Get started" }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(
//     page.getByRole("heading", { name: "Installation" }),
//   ).toBeVisible();
// });
