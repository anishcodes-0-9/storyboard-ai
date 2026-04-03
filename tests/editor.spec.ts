import { expect, test } from "@playwright/test";

test.describe("Storyboard editor", () => {
  test("loads the editor workspace", async ({ page }) => {
    await page.goto("/editor");

    await expect(
      page.getByRole("heading", { name: "Storyboard workspace" }),
    ).toBeVisible();

    await expect(page.getByText("Prompt Composer")).toBeVisible();
    await expect(page.getByText("Session History")).toBeVisible();
    await expect(page.getByText("Hydrated")).toBeVisible();
  });

  test("persists prompt edits after refresh", async ({ page }) => {
    await page.goto("/editor");

    const prompt = page.locator("textarea").first();
    const updatedPrompt = "Playwright prompt persistence test";

    await prompt.fill(updatedPrompt);
    await page.waitForTimeout(800);
    await page.reload();

    await expect(prompt).toHaveValue(updatedPrompt);
  });

  test("edits and saves a section", async ({ page }) => {
    await page.goto("/editor");

    const firstEditButton = page
      .getByRole("button")
      .filter({ hasText: "" })
      .nth(4);
    await firstEditButton.click();

    const editor = page.locator("textarea").nth(1);
    await editor.fill("Playwright edited line 1\nPlaywright edited line 2");

    await page
      .getByRole("button")
      .filter({ has: page.locator("svg") })
      .nth(4)
      .click();

    await expect(page.getByText("Playwright edited line 1")).toBeVisible();
    await expect(page.getByText("Playwright edited line 2")).toBeVisible();

    await page.reload();

    await expect(page.getByText("Playwright edited line 1")).toBeVisible();
    await expect(page.getByText("Playwright edited line 2")).toBeVisible();
  });

  test("canceling a section edit does not persist changes", async ({
    page,
  }) => {
    await page.goto("/editor");

    const firstEditButton = page
      .getByRole("button")
      .filter({ hasText: "" })
      .nth(4);
    await firstEditButton.click();

    const editor = page.locator("textarea").nth(1);
    await editor.fill("This should be canceled");

    await page
      .getByRole("button")
      .filter({ has: page.locator("svg") })
      .nth(5)
      .click();

    await expect(page.getByText("This should be canceled")).not.toBeVisible();
  });

  test("regenerates a section", async ({ page }) => {
    await page.goto("/editor");

    await page.getByRole("button").filter({ hasText: "" }).nth(5).click();

    await expect(
      page.getByText(
        "Storyboard AI converts rough product thinking into a polished narrative artifact designed for review, alignment, and presentation.",
      ),
    ).toBeVisible();
  });

  test("switches template and keeps it after refresh", async ({ page }) => {
    await page.goto("/editor");

    await page.getByRole("button", { name: /Product strategy/i }).click();

    await expect(page.getByText("product strategy")).toBeVisible();

    await page.waitForTimeout(800);
    await page.reload();

    await expect(page.getByText("product strategy")).toBeVisible();
  });
});
