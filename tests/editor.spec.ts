import { expect, test } from "@playwright/test";

test.describe("Storyboard editor", () => {
  test("loads the editor workspace", async ({ page }) => {
    await page.goto("/editor");

    await expect(page).toHaveTitle(/Storyboard AI/i);
    await expect(page.getByText("Prompt Composer")).toBeVisible();
    await expect(page.getByText("Session History")).toBeVisible();
    await expect(page.getByText("Hydrated")).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 1, name: /new product launch/i }),
    ).toBeVisible();
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

    await page.getByRole("button", { name: "Edit Narrative Summary" }).click();

    const editor = page.getByRole("textbox", {
      name: "Editor for Narrative Summary",
    });
    await editor.fill("Playwright edited line 1\nPlaywright edited line 2");

    await page.getByRole("button", { name: "Save Narrative Summary" }).click();

    await expect(page.getByText("Playwright edited line 1")).toBeVisible();
    await expect(page.getByText("Playwright edited line 2")).toBeVisible();

    await page.waitForTimeout(800);
    await page.reload();

    await expect(page.getByText("Playwright edited line 1")).toBeVisible();
    await expect(page.getByText("Playwright edited line 2")).toBeVisible();
  });

  test("canceling a section edit does not persist changes", async ({
    page,
  }) => {
    await page.goto("/editor");

    await page.getByRole("button", { name: "Edit Narrative Summary" }).click();

    const editor = page.getByRole("textbox", {
      name: "Editor for Narrative Summary",
    });
    await editor.fill("This should be canceled");

    await page
      .getByRole("button", { name: "Cancel Narrative Summary" })
      .click();

    await expect(page.getByText("This should be canceled")).not.toBeVisible();
  });

  test("regenerates a section", async ({ page }) => {
    await page.goto("/editor");

    await page
      .getByRole("button", { name: "Regenerate Narrative Summary" })
      .click();

    await expect(
      page.getByText(
        "Storyboard AI converts rough product thinking into a polished narrative artifact designed for review, alignment, and presentation.",
      ),
    ).toBeVisible();
  });

  test("switches template and keeps it after refresh", async ({ page }) => {
    await page.goto("/editor");

    await page.getByRole("button", { name: /Product strategy/i }).click();

    await expect(page.getByLabel("Active template")).toHaveText(
      /Product Strategy/i,
    );

    await page.waitForTimeout(800);
    await page.reload();

    await expect(page.getByLabel("Active template")).toHaveText(
      /Product Strategy/i,
    );
  });

  test("generates storyboard content from the prompt", async ({ page }) => {
    await page.route("**/api/generate-storyboard", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          artifactTitle: "Football Coaching Assistant Storyboard",
          artifactSubtitle: "Launch Brief generated from your latest prompt",
          sections: [
            {
              id: "summary",
              title: "Narrative Summary",
              kind: "summary",
              tone: "Confident",
              status: "ai",
              content: ["Generated summary line 1", "Generated summary line 2"],
            },
            {
              id: "pillars",
              title: "Strategic Pillars",
              kind: "bullets",
              tone: "Sharp",
              status: "ai",
              content: ["Generated pillar 1", "Generated pillar 2"],
            },
            {
              id: "roadmap",
              title: "Milestone Roadmap",
              kind: "timeline",
              tone: "Operational",
              status: "ai",
              content: ["Generated roadmap 1", "Generated roadmap 2"],
            },
            {
              id: "success",
              title: "Success Signals",
              kind: "metrics",
              tone: "Measured",
              status: "ai",
              content: ["Generated success 1", "Generated success 2"],
            },
          ],
        }),
      });
    });

    await page.goto("/editor");

    const prompt = page.locator("textarea").first();
    const previousTitle = await page
      .getByRole("heading", { level: 1 })
      .textContent();

    await prompt.fill(
      "Create a cinematic storyboard for a football coaching assistant app for college teams.",
    );

    await page.getByRole("button", { name: /Generate storyboard/i }).click();

    await expect(
      page
        .locator("p")
        .filter({ hasText: "Storyboard generated with AI" })
        .first(),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Football Coaching Assistant Storyboard/i,
      }),
    ).toBeVisible();

    const nextTitle = await page
      .getByRole("heading", { level: 1 })
      .textContent();
    expect(nextTitle).not.toBe(previousTitle);
  });

  test("generation reflects selected template in subtitle", async ({
    page,
  }) => {
    await page.route("**/api/generate-storyboard", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          artifactTitle: "AI Launch Storyboard",
          artifactSubtitle:
            "Executive Summary generated from your latest prompt",
          sections: [
            {
              id: "summary",
              title: "Narrative Summary",
              kind: "summary",
              tone: "Confident",
              status: "ai",
              content: ["Summary line 1", "Summary line 2"],
            },
            {
              id: "pillars",
              title: "Strategic Pillars",
              kind: "bullets",
              tone: "Sharp",
              status: "ai",
              content: ["Pillar 1", "Pillar 2"],
            },
            {
              id: "roadmap",
              title: "Milestone Roadmap",
              kind: "timeline",
              tone: "Operational",
              status: "ai",
              content: ["Roadmap 1", "Roadmap 2"],
            },
            {
              id: "success",
              title: "Success Signals",
              kind: "metrics",
              tone: "Measured",
              status: "ai",
              content: ["Success 1", "Success 2"],
            },
          ],
        }),
      });
    });

    await page.goto("/editor");

    const prompt = page.locator("textarea").first();
    await prompt.fill(
      "Build a concise storyboard for an AI product launch narrative.",
    );

    await page.getByRole("button", { name: /Executive summary/i }).click();
    await expect(page.getByLabel("Active template")).toHaveText(
      /Executive Summary/i,
    );

    await page.getByRole("button", { name: /Generate storyboard/i }).click();

    await expect(
      page.getByText(/Executive Summary generated from your latest prompt/i),
    ).toBeVisible();
  });

  test("generated artifact persists after refresh", async ({ page }) => {
    await page.route("**/api/generate-storyboard", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          artifactTitle: "Recruiting Platform Storyboard",
          artifactSubtitle: "Launch Brief generated from your latest prompt",
          sections: [
            {
              id: "summary",
              title: "Narrative Summary",
              kind: "summary",
              tone: "Confident",
              status: "ai",
              content: ["Persisted summary 1", "Persisted summary 2"],
            },
            {
              id: "pillars",
              title: "Strategic Pillars",
              kind: "bullets",
              tone: "Sharp",
              status: "ai",
              content: ["Persisted pillar 1", "Persisted pillar 2"],
            },
            {
              id: "roadmap",
              title: "Milestone Roadmap",
              kind: "timeline",
              tone: "Operational",
              status: "ai",
              content: ["Persisted roadmap 1", "Persisted roadmap 2"],
            },
            {
              id: "success",
              title: "Success Signals",
              kind: "metrics",
              tone: "Measured",
              status: "ai",
              content: ["Persisted success 1", "Persisted success 2"],
            },
          ],
        }),
      });
    });

    await page.goto("/editor");

    const prompt = page.locator("textarea").first();
    await prompt.fill(
      "Create a storyboard for a football recruiting platform for college coaches",
    );

    await page.getByRole("button", { name: /Generate storyboard/i }).click();

    await expect(
      page
        .locator("p")
        .filter({ hasText: "Storyboard generated with AI" })
        .first(),
    ).toBeVisible();

    const generatedTitle = await page
      .getByRole("heading", { level: 1 })
      .textContent();

    await page.waitForTimeout(800);
    await page.reload();

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      generatedTitle ?? "",
    );
  });

  test("saves and restores snapshots across refresh", async ({ page }) => {
    await page.goto("/editor");

    const prompt = page.locator("textarea").first();

    await prompt.fill("First snapshot prompt");
    await page.getByRole("button", { name: /Generate storyboard/i }).click();
    await page.getByRole("button", { name: /Save snapshot/i }).click();

    await expect(page.getByText("Snapshot 1", { exact: true })).toBeVisible();

    await prompt.fill("Second snapshot prompt");
    await page.getByRole("button", { name: /Generate storyboard/i }).click();
    await page.getByRole("button", { name: /Save snapshot/i }).click();

    await expect(page.getByText("Snapshot 2", { exact: true })).toBeVisible();

    const restoreButtons = page.getByRole("button", { name: /Restore/i });
    await restoreButtons.nth(1).click();

    await expect(prompt).toHaveValue("First snapshot prompt");

    await page.waitForTimeout(800);
    await page.reload();

    await expect(prompt).toHaveValue("First snapshot prompt");
    await expect(page.getByText("Snapshot 1", { exact: true })).toBeVisible();
    await expect(page.getByText("Snapshot 2", { exact: true })).toBeVisible();
  });

  test("saves an artifact to the library and reloads it", async ({ page }) => {
    await page.route("**/api/generate-storyboard", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          artifactTitle: "Library Artifact",
          artifactSubtitle: "Launch Brief generated from your latest prompt",
          sections: [
            {
              id: "summary",
              title: "Narrative Summary",
              kind: "summary",
              tone: "Confident",
              status: "ai",
              content: ["Library summary 1", "Library summary 2"],
            },
            {
              id: "pillars",
              title: "Strategic Pillars",
              kind: "bullets",
              tone: "Sharp",
              status: "ai",
              content: ["Library pillar 1", "Library pillar 2"],
            },
            {
              id: "roadmap",
              title: "Milestone Roadmap",
              kind: "timeline",
              tone: "Operational",
              status: "ai",
              content: ["Library roadmap 1", "Library roadmap 2"],
            },
            {
              id: "success",
              title: "Success Signals",
              kind: "metrics",
              tone: "Measured",
              status: "ai",
              content: ["Library success 1", "Library success 2"],
            },
          ],
        }),
      });
    });

    await page.goto("/editor");

    const prompt = page.locator("textarea").first();
    await prompt.fill("Library artifact prompt");
    await page.getByRole("button", { name: /Generate storyboard/i }).click();

    await page.getByRole("button", { name: /Save to library/i }).click();
    await page.waitForTimeout(800);

    await page.goto("/library");

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /return to previous storyboard drafts/i,
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("button", { name: /Open artifact/i }),
    ).toHaveCount(1);
    await page.getByRole("button", { name: /Open artifact/i }).click();

    await expect(page.locator("textarea").first()).toHaveValue(
      "Library artifact prompt",
    );

    await page.waitForTimeout(800);
    await page.reload();

    await page.goto("/library");
    await expect(
      page.getByRole("button", { name: /Open artifact/i }),
    ).toHaveCount(1);
  });

  test("opens a saved artifact in read-only share view", async ({ page }) => {
    await page.route("**/api/generate-storyboard", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          artifactTitle: "Shared Artifact",
          artifactSubtitle: "Launch Brief generated from your latest prompt",
          sections: [
            {
              id: "summary",
              title: "Narrative Summary",
              kind: "summary",
              tone: "Confident",
              status: "ai",
              content: ["Shared summary 1", "Shared summary 2"],
            },
            {
              id: "pillars",
              title: "Strategic Pillars",
              kind: "bullets",
              tone: "Sharp",
              status: "ai",
              content: ["Shared pillar 1", "Shared pillar 2"],
            },
            {
              id: "roadmap",
              title: "Milestone Roadmap",
              kind: "timeline",
              tone: "Operational",
              status: "ai",
              content: ["Shared roadmap 1", "Shared roadmap 2"],
            },
            {
              id: "success",
              title: "Success Signals",
              kind: "metrics",
              tone: "Measured",
              status: "ai",
              content: ["Shared success 1", "Shared success 2"],
            },
          ],
        }),
      });
    });

    await page.goto("/editor");

    const prompt = page.locator("textarea").first();
    await prompt.fill("Shared artifact prompt");
    await page.getByRole("button", { name: /Generate storyboard/i }).click();

    await page.getByRole("button", { name: /Save to library/i }).click();
    await page.waitForTimeout(800);

    await page.goto("/library");
    await page.getByRole("link", { name: /Read-only view/i }).click();

    await expect(
      page.getByRole("heading", { level: 1, name: "Shared Artifact" }),
    ).toBeVisible();

    await expect(
      page.getByText(/generated from your latest prompt/i),
    ).toBeVisible();
    await expect(page.getByText("Narrative Summary")).toBeVisible();
    await expect(page.getByText("Strategic Pillars")).toBeVisible();

    await expect(page.locator("textarea")).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: /Edit Narrative Summary/i }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: /Regenerate Narrative Summary/i }),
    ).toHaveCount(0);
  });

  test("saves an artifact as a new library entry", async ({ page }) => {
    await page.goto("/editor");

    await page.route("**/api/generate-storyboard", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          artifactTitle: "Original Artifact",
          artifactSubtitle: "Launch Brief generated from your latest prompt",
          sections: [
            {
              id: "summary",
              title: "Narrative Summary",
              kind: "summary",
              tone: "Confident",
              status: "ai",
              content: ["Original summary 1", "Original summary 2"],
            },
            {
              id: "pillars",
              title: "Strategic Pillars",
              kind: "bullets",
              tone: "Sharp",
              status: "ai",
              content: ["Original pillar 1", "Original pillar 2"],
            },
            {
              id: "roadmap",
              title: "Milestone Roadmap",
              kind: "timeline",
              tone: "Operational",
              status: "ai",
              content: ["Original roadmap 1", "Original roadmap 2"],
            },
            {
              id: "success",
              title: "Success Signals",
              kind: "metrics",
              tone: "Measured",
              status: "ai",
              content: ["Original success 1", "Original success 2"],
            },
          ],
        }),
      });
    });

    const prompt = page.locator("textarea").first();
    await prompt.fill("Original library prompt");
    await page.getByRole("button", { name: /Generate storyboard/i }).click();
    await page.getByRole("button", { name: /Save to library/i }).click();
    await page.waitForTimeout(800);

    await page.route("**/api/generate-storyboard", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          artifactTitle: "Variant Artifact",
          artifactSubtitle: "Launch Brief generated from your latest prompt",
          sections: [
            {
              id: "summary",
              title: "Narrative Summary",
              kind: "summary",
              tone: "Confident",
              status: "ai",
              content: ["Variant summary 1", "Variant summary 2"],
            },
            {
              id: "pillars",
              title: "Strategic Pillars",
              kind: "bullets",
              tone: "Sharp",
              status: "ai",
              content: ["Variant pillar 1", "Variant pillar 2"],
            },
            {
              id: "roadmap",
              title: "Milestone Roadmap",
              kind: "timeline",
              tone: "Operational",
              status: "ai",
              content: ["Variant roadmap 1", "Variant roadmap 2"],
            },
            {
              id: "success",
              title: "Success Signals",
              kind: "metrics",
              tone: "Measured",
              status: "ai",
              content: ["Variant success 1", "Variant success 2"],
            },
          ],
        }),
      });
    });

    await prompt.fill("Variant library prompt");
    await page.getByRole("button", { name: /Generate storyboard/i }).click();
    await page.getByRole("button", { name: /Save as new/i }).click();
    await page.waitForTimeout(800);

    await page.goto("/library");

    await expect(page.getByText("Original Artifact")).toBeVisible();
    await expect(page.getByText("Variant Artifact")).toBeVisible();
  });
});
