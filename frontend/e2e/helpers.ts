import { expect, type Page } from "@playwright/test";

/** Links del nav principal (evita colisión con el logo o links del detalle). */
export function headerNav(page: Page, href: string) {
  return page.locator(`header nav a[href="${href}"]`);
}

export function statusBadge(page: Page, label: string) {
  return page.locator("main span.rounded-full").filter({ hasText: label });
}

export async function waitForAppReady(page: Page) {
  await expect(headerNav(page, "/obligations")).toBeVisible({
    timeout: 30_000,
  });
  await expect(
    page.getByRole("heading", { name: "Dashboard", level: 1 }),
  ).toBeVisible({ timeout: 30_000 });
}

function hrefUrlPattern(href: string): RegExp {
  if (href === "/") {
    return /\/($|\?)/;
  }
  return new RegExp(`${href.replace(/\//g, "\\/")}(\\?|$)`);
}

export async function followHeaderLink(page: Page, href: string) {
  const link = headerNav(page, href);
  await expect(link).toBeVisible();
  await Promise.all([
    page.waitForURL(hrefUrlPattern(href), { timeout: 15_000 }),
    link.click(),
  ]);
}

export async function followMainLink(page: Page, href: string) {
  const link = page.locator(`main a[href="${href}"]`);
  await expect(link).toBeVisible();
  await Promise.all([
    page.waitForURL(hrefUrlPattern(href), { timeout: 15_000 }),
    link.click(),
  ]);
}

export async function followMainLinkContaining(
  page: Page,
  hrefPart: string,
  urlPattern: RegExp,
) {
  const link = page.locator(`main a[href*="${hrefPart}"]`);
  await expect(link).toBeVisible();
  await Promise.all([
    page.waitForURL(urlPattern, { timeout: 15_000 }),
    link.click(),
  ]);
}

export async function openObligationRow(
  page: Page,
  title: RegExp,
  url: RegExp,
) {
  const row = page.locator("main tbody tr").filter({ hasText: title });
  await expect(row).toBeVisible();
  await Promise.all([page.waitForURL(url, { timeout: 15_000 }), row.click()]);
}

export async function expectToast(page: Page, message: string) {
  await expect(
    page.locator(".Toastify__toast").filter({ hasText: message }),
  ).toBeVisible({ timeout: 10_000 });
}

export async function clickTransitionAndExpectState(
  page: Page,
  actionLabel: string,
  stateLabel: string,
) {
  await clickDetailAction(page, actionLabel);
  await expect(statusBadge(page, stateLabel)).toBeVisible({ timeout: 15_000 });
}

export async function fillObligationForm(
  page: Page,
  fields: Record<string, string>,
) {
  const form = page.locator("main form");
  for (const [label, value] of Object.entries(fields)) {
    await form.getByLabel(label, { exact: true }).fill(value);
  }
}

export async function submitObligationForm(page: Page, saveLabel: string) {
  const submit = page
    .locator('main form button[type="submit"]')
    .filter({ hasText: saveLabel });
  await expect(submit).toBeVisible();
  await submit.click();
}

export async function switchLanguage(page: Page, locale: "es" | "en") {
  await page
    .getByRole("contentinfo")
    .getByRole("button", { name: locale.toUpperCase(), exact: true })
    .click();
}

export async function waitForDetailHeading(page: Page, title: string) {
  await expect(
    page.locator("main h1").filter({ hasText: title }),
  ).toBeVisible({ timeout: 15_000 });
}

export async function clickDetailAction(
  page: Page,
  label: string,
  options?: { exact?: boolean },
) {
  const button = page
    .locator("main")
    .getByRole("button", { name: label, exact: options?.exact ?? true });
  await expect(button).toBeVisible();
  await button.click();
}
