/**
 * Playwright test utilities
 * Custom test and expect with authentication helpers
 */
import { test as base, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

// No authentication in this simple app, but keeping the pattern
// for consistency with the conventions

/**
 * Navigate to home page (no login needed in this app)
 */
export async function logIn(page: Page): Promise<void> {
  await page.goto('/');
  // This app has no authentication - we just navigate to home
  // Keeping this function for pattern consistency
}

/**
 * Custom test with any setup needed
 */
export const test = base;

export { expect };
