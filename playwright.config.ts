import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: 2,
  timeout: 30000,
  retries: 0,
  use: {
    baseURL: process.env.PREVIEW_URL || "http://127.0.0.1:4173",
    browserName: "chromium",
    launchOptions: {
      executablePath: process.env.BROWSER_PATH || undefined,
      args: process.env.CI
        ? ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"]
        : undefined,
    },
    trace: "retain-on-failure",
  },
  webServer: process.env.PREVIEW_URL
    ? undefined
    : {
        command: `"${process.execPath}" node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4173 --strictPort`,
        url: "http://127.0.0.1:4173",
        reuseExistingServer: !process.env.CI,
      },
});
