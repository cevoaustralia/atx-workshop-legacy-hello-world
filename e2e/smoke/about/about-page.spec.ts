/**
 * Smoke tests for about page
 * Route: /about
 */
import { test, expect, logIn } from '../utils/test';

test.describe('About Page', () => {
  test('should render about page', async ({ page }) => {
    await logIn(page);
    await page.goto('/about');

    // Assert page heading
    await expect(page.getByRole('heading', { name: 'About' })).toBeVisible();

    // Assert main description text
    await expect(
      page.getByText('This little app says hello in a few languages.')
    ).toBeVisible();
    await expect(
      page.getByText('It was written in 2019 and has not been touched since.')
    ).toBeVisible();

    // Assert tip box is visible
    await expect(page.getByText(/Tip:/)).toBeVisible();
    await expect(
      page.getByText('pick a greeting on the home page to make it your favourite.')
    ).toBeVisible();
  });

  test('should navigate to about page from header', async ({ page }) => {
    await logIn(page);

    // Click About link in header
    await page.getByRole('link', { name: 'About' }).click();

    // Assert navigation to about page
    await expect(page).toHaveURL('/about');
    await expect(page.getByRole('heading', { name: 'About' })).toBeVisible();
  });

  test('should navigate back to home from about page', async ({ page }) => {
    await logIn(page);
    await page.goto('/about');

    // Click Home link in header
    await page.getByRole('link', { name: 'Hello World' }).click();

    // Assert navigation to home page
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'Hello, World!' })).toBeVisible();
  });
});
