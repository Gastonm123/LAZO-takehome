import { defineConfig, devices } from "@playwright/test";

/** Puerto distinto al dev habitual (3000) para no reutilizar un server sin mock. */
const port = process.env.PLAYWRIGHT_PORT ?? "3001";
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 60_000,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
    locale: "es-AR",
    actionTimeout: 15_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `USE_MOCK_DATA=true API_URL=http://localhost:5000/api/v1 NEXT_PUBLIC_DEFAULT_LOCALE=es npm run dev -- --port ${port} --hostname localhost`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
