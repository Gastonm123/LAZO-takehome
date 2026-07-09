import { expect, test } from "@playwright/test";
import {
  clickTransitionAndExpectState,
  fillObligationForm,
  followHeaderLink,
  followMainLink,
  followMainLinkContaining,
  headerNav,
  openObligationRow,
  statusBadge,
  submitObligationForm,
  switchLanguage,
  waitForAppReady,
  waitForDetailHeading,
} from "./helpers";

/**
 * Flujo E2E de experiencia de usuario sobre datos mock (USE_MOCK_DATA=true).
 * Selectores acotados a header/main/footer para evitar ambigüedades de i18n y strict mode.
 */
test.describe("Experiencia de usuario", () => {
  test.beforeEach(async ({ context }) => {
    await context.addInitScript(() => {
      localStorage.clear();
    });
  });

  test("recorre dashboard, listado, detalle, transición, alta y edición", async ({
    page,
  }) => {
    test.setTimeout(120_000);

    const createdTitle = `Obligacion E2E ${Date.now()}`;
    const editedTitle = `${createdTitle} (editada)`;

    // Dashboard
    await page.goto("/");
    await waitForAppReady(page);
    await expect(page.locator("main").getByText("Total", { exact: true })).toBeVisible();
    await expect(page.locator("main").getByText("Vencidos", { exact: true })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Próximos 10 vencimientos" }),
    ).toBeVisible();

    // Dashboard → detalle (click en fila)
    await openObligationRow(page, /Annual Report 2025/, /\/obligations\/1$/);
    await waitForDetailHeading(page, "Annual Report 2025");
    await expect(statusBadge(page, "Pendiente")).toBeVisible();

    // Listado + búsqueda
    await followHeaderLink(page, "/obligations");
    await expect(
      page.getByRole("heading", { name: "Obligaciones", level: 1 }),
    ).toBeVisible();

    const search = page.getByPlaceholder("Buscar obligaciones...");
    await search.fill("Franchise");
    await expect(
      page.locator("main tbody tr").filter({ hasText: /Franchise Tax Payment/ }),
    ).toBeVisible();
    await expect(
      page.locator("main tbody tr").filter({ hasText: /Annual Report 2025/ }),
    ).toHaveCount(0);
    await search.clear();

    // Obligación vencida + audit
    await openObligationRow(page, /Annual Report Amendment/, /\/obligations\/5$/);
    await expect(statusBadge(page, "Vencido")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Historial de cambios" }),
    ).toBeVisible();

    // Transición de estado
    await followHeaderLink(page, "/obligations");
    await openObligationRow(page, /Annual Report 2025/, /\/obligations\/1$/);
    await clickTransitionAndExpectState(page, "Iniciar", "En progreso");

    // Alta
    await followHeaderLink(page, "/obligations");
    await followMainLink(page, "/obligations/new");
    await expect(
      page.getByRole("heading", { name: "Nueva obligación", level: 1 }),
    ).toBeVisible();

    await fillObligationForm(page, {
      Tipo: "compliance_review",
      Responsable: "QA E2E",
      Título: createdTitle,
      Descripción: "Creada por Playwright",
      "Tax ID de la empresa": "12-3456789",
    });
    await Promise.all([
      page.waitForURL(/\/obligations\/\d+$/, { timeout: 15_000 }),
      submitObligationForm(page, "Guardar"),
    ]);
    await waitForDetailHeading(page, createdTitle);

    // Edición
    await followMainLinkContaining(page, "/edit", /\/obligations\/\d+\/edit$/);
    await fillObligationForm(page, { Título: editedTitle });
    await Promise.all([
      page.waitForURL(/\/obligations\/\d+$/, { timeout: 15_000 }),
      submitObligationForm(page, "Guardar"),
    ]);
    await waitForDetailHeading(page, editedTitle);

    // i18n
    await switchLanguage(page, "en");
    await expect(headerNav(page, "/obligations")).toHaveText("Obligations", {
      timeout: 10_000,
    });
    await expect(
      page.getByRole("heading", { name: "Audit trail" }),
    ).toBeVisible();
    await expect(
      page.locator('main a[href*="/edit"]').filter({ hasText: "Edit" }),
    ).toBeVisible();
  });
});
