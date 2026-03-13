import { defineConfig, devices } from '@playwright/test';

import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  expect: {
    timeout: process.env.CI ? 20000 : 10000,
  },
  timeout: process.env.CI ? 60000 : 30000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 4 : 2,
  reporter: process.env.CI
    ? [['html'], ['junit', { outputFile: 'test-results/results.xml' }], ['dot']]
    : [['html'], ['junit', { outputFile: 'test-results/results.xml' }], ['dot']],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://www.demoblaze.com',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    headless: true,
  },
  projects: [
    {
      name: 'setup',
      testDir: './helpers',
    },
    {
      name: 'TestOnChrome',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1920, height: 1080 } },
      dependencies: ['setup'],
    },
    {
      name: 'TestOnEdge',
      use: { ...devices['Desktop Edge'], viewport: { width: 1920, height: 1080 }, channel: 'msedge' },
      dependencies: ['setup'],
    },
    {
      name: 'TestOnFirefox',
      use: { ...devices['Desktop Firefox'], viewport: { width: 1920, height: 1080 } },
      dependencies: ['setup'],
    },
    {
      name: 'API',
      testMatch: 'tests/api/**/*.spec.ts',
    },
  ],
});
