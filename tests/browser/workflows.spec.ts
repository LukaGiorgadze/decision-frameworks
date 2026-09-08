import { test, expect } from "@playwright/test";
import { frameworks } from "../../lib/frameworks";

test("catalog search, category filter, empty state, and navigation", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Decision frameworks");
  await expect(page.getByRole("status")).toHaveText("Showing 6 of 6 frameworks");
  await page.getByLabel("Search frameworks").fill("weighted");
  await expect(page.getByRole("status")).toHaveText("Showing 1 of 6 frameworks");
  await page.getByRole("button", { name: "Assess risks", exact: true }).click();
  await expect(page.getByText("No frameworks found")).toBeVisible();
  await page.getByRole("button", { name: "Clear filters", exact: true }).click();
  await page.getByRole("link", { name: "Eisenhower Matrix", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Eisenhower Matrix", exact: true })).toBeVisible();
});

test("matrix saves, restores, moves tasks, preserves examples, and confirms reset", async ({ page }) => {
  await page.goto("/frameworks/eisenhower-matrix");
  await page.getByLabel("What are you deciding?", { exact: true }).fill("My week");
  await page.getByRole("button", { name: "Add task to do now", exact: true }).click();
  const quadrant = page.getByRole("region", { name: "Do now quadrant", exact: true });
  await quadrant.getByLabel("Task", { exact: true }).fill("Fix customer issue");
  await quadrant.getByText("Details", { exact: true }).click();
  await quadrant.getByLabel("Next action (optional)").fill("Call Jordan");
  await quadrant.getByLabel("Owner (optional)").fill("Alex");
  await quadrant.getByLabel("Date (optional)").fill("2026-10-01");
  await page.reload();
  await expect(page.getByLabel("What are you deciding?", { exact: true })).toHaveValue("My week");
  await expect(quadrant.getByLabel("Task", { exact: true })).toHaveValue("Fix customer issue");
  await quadrant.getByText("Details", { exact: true }).click();
  await quadrant.getByLabel("Move to quadrant").selectOption("schedule");
  await expect(page.getByRole("region", { name: "Schedule quadrant", exact: true }).getByLabel("Task", { exact: true })).toHaveValue("Fix customer issue");
  await page.getByText("How to use this framework", { exact: true }).click();
  await expect(page.getByLabel("What are you deciding?", { exact: true })).toHaveValue("My week");
  await page.getByRole("link", { name: "Back", exact: true }).click();
  await page.getByRole("link", { name: "Eisenhower Matrix", exact: true }).click();
  await expect(page.getByLabel("What are you deciding?", { exact: true })).toHaveValue("My week");
  await page.getByRole("button", { name: "Start over", exact: true }).click();
  await page.getByRole("button", { name: "Keep my work", exact: true }).click();
  await expect(page.getByLabel("What are you deciding?", { exact: true })).toHaveValue("My week");
  await page.getByRole("button", { name: "Start over", exact: true }).click();
  await page.getByRole("alertdialog").getByRole("button", { name: "Start over", exact: true }).click();
  await expect(page.getByLabel("What are you deciding?", { exact: true })).toHaveValue("");
  await page.reload();
  await expect(page.getByLabel("What are you deciding?", { exact: true })).toHaveValue("");
});

test("weighted scores follow entered criteria and suppress incomplete comparisons", async ({ page }) => {
  await page.goto("/frameworks/weighted-scoring");
  await page.getByRole("button", { name: "Remove criterion 3", exact: true }).click();
  await page.getByLabel("Criterion 1 name", { exact: true }).fill("Affordability");
  await page.getByLabel("Criterion 2 name", { exact: true }).fill("Quiet");
  await page.getByLabel("Criterion 2 weight", { exact: true }).selectOption("2");
  await page.getByLabel("Option 1 name", { exact: true }).fill("Library");
  await page.getByLabel("Option 2 name", { exact: true }).fill("Café");
  await page.getByLabel("Library: Affordability", { exact: true }).selectOption("5");
  await page.getByLabel("Library: Quiet", { exact: true }).selectOption("4");
  await page.getByLabel("Café: Affordability", { exact: true }).selectOption("3");
  await page.getByLabel("Café: Quiet", { exact: true }).selectOption("2");
  const result = page.getByRole("region", { name: "Your comparison", exact: true });
  await expect(result).toContainText("4.6"); await expect(result).toContainText("2.6");
  await page.getByLabel("Café: Quiet", { exact: true }).selectOption("");
  await expect(result).not.toContainText("4.6");
  await expect(result).toContainText("fill in all ratings");
});

test("cost–benefit totals do not treat blanks as zero", async ({ page }) => {
  await page.goto("/frameworks/cost-benefit-analysis");
  for (const i of [1, 2]) {
    await page.getByLabel(`Option ${i} name`, { exact: true }).fill(`Tool ${i}`);
    await page.getByLabel(`Option ${i}, item 1 description`, { exact: true }).fill("Subscription");
    await page.getByLabel(`Option ${i}, item 2 description`, { exact: true }).fill("Time saved");
    await page.getByLabel(`Amount (USD) for option ${i}, item 1`, { exact: true }).fill(i === 1 ? "240" : "480");
    await page.getByLabel(`Amount (USD) for option ${i}, item 2`, { exact: true }).fill(i === 1 ? "900" : "1000");
  }
  const result = page.getByRole("region", { name: "Your comparison", exact: true });
  await expect(result).toContainText("$660.00"); await expect(result).toContainText("$520.00");
  await page.getByLabel("Amount (USD) for option 1, item 1", { exact: true }).fill("");
  await expect(result).not.toContainText("$660.00");
  await expect(result).toContainText("Incomplete");
  await page.getByLabel("Amount (USD) for option 1, item 1", { exact: true }).fill("-5");
  await expect(page.getByText("Enter zero or a positive number.", { exact: true })).toBeVisible();
});

test("RICE validates effort and marks partial rankings provisional", async ({ page }) => {
  await page.goto("/frameworks/rice-scoring");
  await page.getByLabel("Idea 1 name", { exact: true }).fill("Guide");
  await page.getByLabel("Reach for idea 1", { exact: true }).fill("1000");
  await page.getByLabel("Impact for idea 1", { exact: true }).selectOption("1");
  await page.getByLabel("Confidence for idea 1", { exact: true }).selectOption("80");
  await page.getByLabel("Effort for idea 1", { exact: true }).fill("2");
  const result = page.getByRole("region", { name: "Your priorities", exact: true });
  await expect(result).toContainText("400"); await expect(result).toContainText("Provisional ranking");
  await page.getByLabel("Effort for idea 1", { exact: true }).fill("0");
  await expect(page.getByText("Enter a number greater than zero.", { exact: true })).toBeVisible();
  await expect(result).not.toContainText("400");
});

test("reflection and pre-mortem capture qualitative work and next actions", async ({ page }) => {
  await page.goto("/frameworks/ten-ten-ten");
  await page.getByLabel("Option 1 name", { exact: true }).fill("Evening course");
  await page.getByLabel("Option 1: 10 minutes", { exact: true }).fill("Excited");
  await page.getByLabel("Option 1: 10 years", { exact: true }).fill("A new direction");
  await page.getByLabel("Which values and priorities matter here?", { exact: true }).fill("Learning");
  await page.getByLabel("My decision", { exact: true }).fill("Start with one module");
  await page.reload();
  await expect(page.getByLabel("My decision", { exact: true })).toHaveValue("Start with one module");
  await page.goto("/frameworks/pre-mortem-analysis");
  await page.getByLabel("What is your plan?", { exact: true }).fill("Run a workshop");
  await page.getByLabel("Cause for risk 1", { exact: true }).fill("Venue cancels");
  const result = page.getByRole("region", { name: "Turn foresight into action", exact: true });
  await expect(result).toContainText("1 risk still needs a prevention action");
  await page.getByLabel("Prevention action for risk 1", { exact: true }).fill("Reserve a backup venue");
  await expect(result).toContainText("Reserve a backup venue");
  await expect(result).not.toContainText("still needs");
});

test("clipboard fallback and print summary retain the user's work", async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(navigator, "clipboard", { value: { writeText: () => Promise.reject(new Error("denied")) }, configurable: true }); });
  await page.goto("/frameworks/ten-ten-ten");
  await page.getByLabel("What are you deciding?", { exact: true }).fill("Choose my next step");
  await page.getByLabel("My decision", { exact: true }).fill("Take the course");
  await page.getByRole("button", { name: "Copy summary", exact: true }).click();
  await expect(page.getByLabel("Copy your summary manually", { exact: true })).toHaveValue(/Take the course/);
  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".print-summary")).toBeVisible();
  await expect(page.locator(".print-summary")).toContainText("Take the course");
  await expect(page.getByLabel("My decision", { exact: true })).toBeHidden();
});

test("unavailable and corrupt storage remain usable and honest", async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(window, "localStorage", { get() { throw new Error("Storage blocked"); } }); });
  await page.goto("/frameworks/eisenhower-matrix");
  await expect(page.locator("main").getByRole("alert")).toContainText("Could not save in this browser");
  await page.getByLabel("What are you deciding?", { exact: true }).fill("Still editable");
  await expect(page.getByLabel("What are you deciding?", { exact: true })).toHaveValue("Still editable");
});

test("corrupt saved content is not overwritten", async ({ page }) => {
  await page.addInitScript(() => { localStorage.setItem("decision-frameworks:v1:rice-scoring", "broken draft"); });
  await page.goto("/frameworks/rice-scoring");
  await expect(page.locator("main").getByRole("alert")).toContainText("Existing draft could not be read");
  await page.getByLabel("What are you deciding?", { exact: true }).fill("Fresh thought");
  expect(await page.evaluate(() => localStorage.getItem("decision-frameworks:v1:rice-scoring"))).toBe("broken draft");
});

test("every route works on mobile without document overflow or animations", async ({ page }) => {
  const errors: string[] = []; page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ["/", ...frameworks.map((f) => `/frameworks/${f.id}`)]) {
    const response = await page.goto(path); expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  }
  expect(errors).toEqual([]);
});

test("keyboard navigation, metadata, sitemap, and unknown framework", async ({ page, request }) => {
  await page.goto("/"); await page.keyboard.press("Tab"); await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter"); await expect(page.locator("#main")).toBeInViewport();
  for (const framework of frameworks) { await page.goto(`/frameworks/${framework.id}`); await expect(page).toHaveTitle(`${framework.name} Template | Decision Frameworks`); }
  const sitemap = await request.get("/sitemap.xml"); expect(sitemap.ok()).toBe(true); const xml = await sitemap.text(); for (const framework of frameworks) expect(xml).toContain(`/frameworks/${framework.id}`);
  const missing = await page.goto("/frameworks/not-a-framework"); expect(missing?.status()).toBe(404); await expect(page.getByRole("link", { name: "Back to all frameworks", exact: true })).toBeVisible();
});

test("the directory and method explanations remain readable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false }); const page = await context.newPage();
  await page.goto(process.env.TEST_BASE_URL || "http://127.0.0.1:3000/");
  await expect(page.getByRole("link", { name: "Eisenhower Matrix", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Eisenhower Matrix", exact: true }).click();
  await expect(page.getByText("Enable JavaScript to edit and save this worksheet.", { exact: false })).toBeVisible();
  await page.getByText("How to use this framework", { exact: true }).click();
  await expect(page.getByText("Make space for the important work in your week.", { exact: true })).toBeVisible();
  await context.close();
});

test("copy reports the current summary and print invokes the browser action", async ({ page }) => {
  await page.addInitScript(() => {
    const state = { copied: "", printed: false };
    Object.defineProperty(window, "testActions", { value: state });
    Object.defineProperty(navigator, "clipboard", { value: { writeText: async (text: string) => { state.copied = text; } }, configurable: true });
    window.print = () => { state.printed = true; };
  });
  await page.goto("/frameworks/ten-ten-ten");
  await page.getByLabel("My decision", { exact: true }).fill("Take the course");
  await page.getByRole("button", { name: "Copy summary", exact: true }).click();
  await expect(page.getByRole("button", { name: "Copied", exact: true })).toBeVisible();
  expect(await page.evaluate(() => (window as unknown as { testActions: { copied: string } }).testActions.copied)).toContain("Take the course");
  await page.getByLabel("My decision", { exact: true }).fill("Wait until next term");
  await expect(page.getByRole("button", { name: "Copy summary", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Print", exact: true }).click();
  expect(await page.evaluate(() => (window as unknown as { testActions: { printed: boolean } }).testActions.printed)).toBe(true);
});

test("templates retain readable controls at 200 percent text size", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ["/", "/frameworks/eisenhower-matrix", "/frameworks/weighted-scoring", "/frameworks/cost-benefit-analysis"]) {
    await page.goto(path);
    await page.addStyleTag({ content: "html { font-size: 200%; }" });
    const overflow = await page.evaluate(() => Array.from(document.querySelectorAll("main *")).filter((element) => element.getBoundingClientRect().right > innerWidth + 1).slice(0, 8).map((element) => ({ tag: element.tagName, text: element.textContent?.slice(0, 60), right: element.getBoundingClientRect().right })));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${path}: ${JSON.stringify(overflow)}`).toBe(true);
  }
});
