/**
 * Smoke tests for greeting detail page
 * Route: /greetings/:id
 */
import { test, expect, logIn } from '../utils/test';

test.describe('Greeting Detail Page', () => {
  test('should render greeting detail page', async ({ page }) => {
    await logIn(page);

    // Navigate to a specific greeting (using ID 1 from fixtures)
    await page.goto('/greetings/1');

    // Assert back link is visible
    await expect(page.getByRole('link', { name: '← All greetings' })).toBeVisible();

    // Assert greeting card is visible with note
    await expect(page.getByText('English')).toBeVisible();
    await expect(page.getByText('Hello, World!')).toBeVisible();
    await expect(page.getByText('The classic first program.')).toBeVisible();

    // Assert favourite button is visible
    await expect(page.getByRole('button', { name: /favourite/i })).toBeVisible();
  });

  test('should toggle favourite status', async ({ page }) => {
    await logIn(page);
    await page.goto('/greetings/1');

    // Initial state - not favourite
    const favouriteButton = page.getByRole('button', { name: 'Make favourite' });
    await expect(favouriteButton).toBeVisible();

    // Click to make favourite
    await favouriteButton.click();

    // Assert button text changed
    await expect(page.getByRole('button', { name: 'Remove favourite' })).toBeVisible();

    // Assert favourite badge appears on card
    await expect(page.getByText('★ Favourite')).toBeVisible();

    // Click to remove favourite
    await page.getByRole('button', { name: 'Remove favourite' }).click();

    // Assert button text changed back
    await expect(page.getByRole('button', { name: 'Make favourite' })).toBeVisible();

    // Assert favourite badge is gone
    await expect(page.getByText('★ Favourite')).not.toBeVisible();
  });

  test('should navigate back to home page when back link is clicked', async ({ page }) => {
    await logIn(page);
    await page.goto('/greetings/1');

    // Click back link
    await page.getByRole('link', { name: '← All greetings' }).click();

    // Assert navigation to home page
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'Hello, World!' })).toBeVisible();
  });

  test('should show error message for non-existent greeting ID', async ({ page }) => {
    await logIn(page);
    await page.goto('/greetings/999');

    // Assert error message
    await expect(page.getByText('No greeting with id 999.')).toBeVisible();

    // Assert back link is still present
    await expect(page.getByRole('link', { name: 'Back' })).toBeVisible();
  });

  test('should render greeting with special characters', async ({ page }) => {
    await logIn(page);

    // Navigate to Spanish greeting (ID 2 from fixtures)
    await page.goto('/greetings/2');

    // Assert Spanish greeting with special characters
    await expect(page.getByText('Spanish')).toBeVisible();
    await expect(page.getByText('¡Hola, Mundo!')).toBeVisible();
    await expect(page.getByText('Spoken by over 500 million people.')).toBeVisible();
  });

  test('should maintain favourite status when navigating between pages', async ({ page }) => {
    await logIn(page);
    await page.goto('/greetings/1');

    // Make favourite
    await page.getByRole('button', { name: 'Make favourite' }).click();
    await expect(page.getByText('★ Favourite')).toBeVisible();

    // Go back to home
    await page.getByRole('link', { name: '← All greetings' }).click();

    // Navigate to greeting again
    await page.goto('/greetings/1');

    // Assert favourite status is maintained
    await expect(page.getByText('★ Favourite')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Remove favourite' })).toBeVisible();
  });
});
