# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: editor.spec.ts >> Storyboard editor >> switches template and keeps it after refresh
- Location: tests/editor.spec.ts:91:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('product strategy')
Expected: visible
Error: strict mode violation: getByText('product strategy') resolved to 2 elements:
    1) <p class="text-sm font-medium text-[var(--text)]">Product strategy</p> aka getByRole('button', { name: 'Product strategy Active Best' })
    2) <div class="rounded-full border border-[var(--panel-border)] bg-[var(--panel)] px-4 py-2 text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">product strategy</div> aka getByText('product strategy', { exact: true })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('product strategy')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - img [ref=e8]
        - generic [ref=e12]:
          - link "Storyboard AI" [ref=e13] [cursor=pointer]:
            - /url: /
          - paragraph [ref=e14]: Build narrative artifacts that feel ready to review.
      - generic [ref=e15]:
        - generic [ref=e16]: Editor mode
        - generic [ref=e17]:
          - img [ref=e18]
          - text: Frontend-first build
  - generic [ref=e22]:
    - complementary [ref=e23]:
      - paragraph [ref=e24]: Input
      - heading "Prompt Composer" [level=2] [ref=e25]
      - generic [ref=e27]:
        - generic [ref=e28]:
          - generic [ref=e29]:
            - paragraph [ref=e30]: Source prompt
            - generic [ref=e31]:
              - img [ref=e32]
              - text: Template switched locally
          - textbox "Describe the story you want to turn into a polished artifact..." [ref=e35]: Create a launch-ready storyboard for an AI tool that converts rough product ideas into polished presentation narratives for team reviews.
          - generic [ref=e36]:
            - button "Generate storyboard" [ref=e37] [cursor=pointer]:
              - img [ref=e38]
              - text: Generate storyboard
            - button "Save snapshot" [ref=e41] [cursor=pointer]:
              - img [ref=e42]
              - text: Save snapshot
        - generic [ref=e45]:
          - paragraph [ref=e46]: Templates
          - generic [ref=e47]:
            - button "Launch brief Template Best for product launches and rollout plans." [ref=e48] [cursor=pointer]:
              - generic [ref=e49]:
                - paragraph [ref=e50]: Launch brief
                - generic [ref=e51]: Template
              - paragraph [ref=e52]: Best for product launches and rollout plans.
            - button "Product strategy Active Best for roadmap, priorities, and strategic direction." [active] [ref=e53] [cursor=pointer]:
              - generic [ref=e54]:
                - paragraph [ref=e55]: Product strategy
                - generic [ref=e56]: Active
              - paragraph [ref=e57]: Best for roadmap, priorities, and strategic direction.
            - button "Executive summary Template Best for concise decision-ready overviews." [ref=e58] [cursor=pointer]:
              - generic [ref=e59]:
                - paragraph [ref=e60]: Executive summary
                - generic [ref=e61]: Template
              - paragraph [ref=e62]: Best for concise decision-ready overviews.
    - generic [ref=e63]:
      - generic [ref=e64]:
        - generic [ref=e65]:
          - paragraph [ref=e66]: Live Artifact
          - heading "Storyboard workspace" [level=1] [ref=e67]
          - paragraph [ref=e68]: "This is the core product surface: prompt in, structured narrative out, with editable sections that can later support regenerate, reorder, export, and share actions."
        - generic [ref=e69]:
          - generic [ref=e70]: product strategy
          - button "Share" [ref=e71] [cursor=pointer]:
            - img [ref=e72]
            - text: Share
          - button "Export PDF" [ref=e78] [cursor=pointer]:
            - img [ref=e79]
            - text: Export PDF
      - generic [ref=e82]:
        - img [ref=e83]
        - text: Drag sections to reorder the artifact
      - generic [ref=e93]:
        - article [ref=e94]:
          - generic [ref=e95]:
            - generic [ref=e96]:
              - generic [ref=e97]:
                - button [ref=e98] [cursor=pointer]:
                  - img [ref=e99]
                - paragraph [ref=e106]: summary
                - generic [ref=e107]: 2 blocks
              - heading "Narrative Summary" [level=3] [ref=e108]
              - paragraph [ref=e109]: "Tone: Confident"
            - generic [ref=e110]:
              - generic [ref=e111]: AI generated
              - button [ref=e112] [cursor=pointer]:
                - img [ref=e113]
              - button [ref=e115] [cursor=pointer]:
                - img [ref=e116]
          - generic [ref=e121]:
            - generic [ref=e122]: Storyboard AI turns rough prompts into structured, presentation-ready narratives with a visual language that feels crafted instead of auto-generated.
            - generic [ref=e123]: The MVP focuses on speed, editability, and section-level regeneration so the output becomes a working artifact, not a disposable draft.
        - article [ref=e124]:
          - generic [ref=e125]:
            - generic [ref=e126]:
              - generic [ref=e127]:
                - button [ref=e128] [cursor=pointer]:
                  - img [ref=e129]
                - paragraph [ref=e136]: bullets
                - generic [ref=e137]: 3 blocks
              - heading "Strategic Pillars" [level=3] [ref=e138]
              - paragraph [ref=e139]: "Tone: Sharp"
            - generic [ref=e140]:
              - generic [ref=e141]: User refined
              - button [ref=e142] [cursor=pointer]:
                - img [ref=e143]
              - button [ref=e145] [cursor=pointer]:
                - img [ref=e146]
          - generic [ref=e151]:
            - generic [ref=e152]: Prompt-first workflow with instant visual payoff
            - generic [ref=e153]: Inline editing that respects manual refinement
            - generic [ref=e154]: Presentation-grade layout, export, and review readiness
        - article [ref=e155]:
          - generic [ref=e156]:
            - generic [ref=e157]:
              - generic [ref=e158]:
                - button [ref=e159] [cursor=pointer]:
                  - img [ref=e160]
                - paragraph [ref=e167]: timeline
                - generic [ref=e168]: 3 blocks
              - heading "Milestone Roadmap" [level=3] [ref=e169]
              - paragraph [ref=e170]: "Tone: Operational"
            - generic [ref=e171]:
              - generic [ref=e172]: AI generated
              - button [ref=e173] [cursor=pointer]:
                - img [ref=e174]
              - button [ref=e176] [cursor=pointer]:
                - img [ref=e177]
          - generic [ref=e182]:
            - generic [ref=e183]: "Week 1: land visual shell, app structure, and prompt workflow"
            - generic [ref=e184]: "Week 2: add editable sections, reorder, and autosave"
            - generic [ref=e185]: "Week 3: connect generation API and polish export flow"
        - article [ref=e186]:
          - generic [ref=e187]:
            - generic [ref=e188]:
              - generic [ref=e189]:
                - button [ref=e190] [cursor=pointer]:
                  - img [ref=e191]
                - paragraph [ref=e198]: metrics
                - generic [ref=e199]: 3 blocks
              - heading "Success Signals" [level=3] [ref=e200]
              - paragraph [ref=e201]: "Tone: Measured"
            - generic [ref=e202]:
              - generic [ref=e203]: AI generated
              - button [ref=e204] [cursor=pointer]:
                - img [ref=e205]
              - button [ref=e207] [cursor=pointer]:
                - img [ref=e208]
          - generic [ref=e213]:
            - generic [ref=e214]: First meaningful artifact generated in under 60 seconds
            - generic [ref=e215]: Users can revise one section without losing the rest
            - generic [ref=e216]: The result feels polished enough to present immediately
      - status [ref=e217]
    - complementary [ref=e218]:
      - paragraph [ref=e219]: Timeline
      - heading "Session History" [level=2] [ref=e220]
      - generic [ref=e222]:
        - generic [ref=e223]:
          - generic [ref=e224]:
            - img [ref=e225]
            - text: Local-first draft safety
          - paragraph [ref=e228]: We keep edits recoverable with snapshots, visible save states, and a workspace that restores after refresh.
        - generic [ref=e229]:
          - generic [ref=e230]:
            - generic [ref=e231]:
              - img [ref=e232]
              - text: Recent activity
            - generic [ref=e236]: Hydrated
          - paragraph [ref=e237]: Template switched locally
          - generic [ref=e238]:
            - generic [ref=e239]:
              - generic [ref=e240]:
                - img [ref=e241]
                - text: Event 1
              - paragraph [ref=e244]: Initial artifact generated from launch brief prompt
            - generic [ref=e245]:
              - generic [ref=e246]:
                - img [ref=e247]
                - text: Event 2
              - paragraph [ref=e250]: Narrative summary refined with a sharper product angle
            - generic [ref=e251]:
              - generic [ref=e252]:
                - img [ref=e253]
                - text: Event 3
              - paragraph [ref=e256]: Roadmap section marked for regenerate after API wiring
        - button "Duplicate current draft" [ref=e257] [cursor=pointer]:
          - img [ref=e258]
          - text: Duplicate current draft
```

# Test source

```ts
  1   | import { expect, test } from "@playwright/test";
  2   | 
  3   | test.describe("Storyboard editor", () => {
  4   |   test("loads the editor workspace", async ({ page }) => {
  5   |     await page.goto("/editor");
  6   | 
  7   |     await expect(
  8   |       page.getByRole("heading", { name: "Storyboard workspace" }),
  9   |     ).toBeVisible();
  10  | 
  11  |     await expect(page.getByText("Prompt Composer")).toBeVisible();
  12  |     await expect(page.getByText("Session History")).toBeVisible();
  13  |     await expect(page.getByText("Hydrated")).toBeVisible();
  14  |   });
  15  | 
  16  |   test("persists prompt edits after refresh", async ({ page }) => {
  17  |     await page.goto("/editor");
  18  | 
  19  |     const prompt = page.locator("textarea").first();
  20  |     const updatedPrompt = "Playwright prompt persistence test";
  21  | 
  22  |     await prompt.fill(updatedPrompt);
  23  |     await page.waitForTimeout(800);
  24  |     await page.reload();
  25  | 
  26  |     await expect(prompt).toHaveValue(updatedPrompt);
  27  |   });
  28  | 
  29  |   test("edits and saves a section", async ({ page }) => {
  30  |     await page.goto("/editor");
  31  | 
  32  |     const firstEditButton = page
  33  |       .getByRole("button")
  34  |       .filter({ hasText: "" })
  35  |       .nth(4);
  36  |     await firstEditButton.click();
  37  | 
  38  |     const editor = page.locator("textarea").nth(1);
  39  |     await editor.fill("Playwright edited line 1\nPlaywright edited line 2");
  40  | 
  41  |     await page
  42  |       .getByRole("button")
  43  |       .filter({ has: page.locator("svg") })
  44  |       .nth(4)
  45  |       .click();
  46  | 
  47  |     await expect(page.getByText("Playwright edited line 1")).toBeVisible();
  48  |     await expect(page.getByText("Playwright edited line 2")).toBeVisible();
  49  | 
  50  |     await page.reload();
  51  | 
  52  |     await expect(page.getByText("Playwright edited line 1")).toBeVisible();
  53  |     await expect(page.getByText("Playwright edited line 2")).toBeVisible();
  54  |   });
  55  | 
  56  |   test("canceling a section edit does not persist changes", async ({
  57  |     page,
  58  |   }) => {
  59  |     await page.goto("/editor");
  60  | 
  61  |     const firstEditButton = page
  62  |       .getByRole("button")
  63  |       .filter({ hasText: "" })
  64  |       .nth(4);
  65  |     await firstEditButton.click();
  66  | 
  67  |     const editor = page.locator("textarea").nth(1);
  68  |     await editor.fill("This should be canceled");
  69  | 
  70  |     await page
  71  |       .getByRole("button")
  72  |       .filter({ has: page.locator("svg") })
  73  |       .nth(5)
  74  |       .click();
  75  | 
  76  |     await expect(page.getByText("This should be canceled")).not.toBeVisible();
  77  |   });
  78  | 
  79  |   test("regenerates a section", async ({ page }) => {
  80  |     await page.goto("/editor");
  81  | 
  82  |     await page.getByRole("button").filter({ hasText: "" }).nth(5).click();
  83  | 
  84  |     await expect(
  85  |       page.getByText(
  86  |         "Storyboard AI converts rough product thinking into a polished narrative artifact designed for review, alignment, and presentation.",
  87  |       ),
  88  |     ).toBeVisible();
  89  |   });
  90  | 
  91  |   test("switches template and keeps it after refresh", async ({ page }) => {
  92  |     await page.goto("/editor");
  93  | 
  94  |     await page.getByRole("button", { name: /Product strategy/i }).click();
  95  | 
> 96  |     await expect(page.getByText("product strategy")).toBeVisible();
      |                                                      ^ Error: expect(locator).toBeVisible() failed
  97  | 
  98  |     await page.waitForTimeout(800);
  99  |     await page.reload();
  100 | 
  101 |     await expect(page.getByText("product strategy")).toBeVisible();
  102 |   });
  103 | });
  104 | 
```