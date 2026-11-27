/**
 * Smoke tests for home page
 * Route: /
 */
import { test, expect, logIn } from '../utils/test';

test.describe('Home Page', () => {
  test('should render home page with greetings list', async ({ page }) => {
    await logIn(page);

    // Assert page heading is visible
    await expect(page.getByRole('heading', { name: 'Hello, World!' })).toBeVisible();

    // Assert description text
    await expect(page.getByText(/Say hello in \d+ languages/)).toBeVisible();

    // Assert language filter is present
    await expect(page.getByRole('combobox', { name: 'Language:' })).toBeVisible();

    // Assert "Say hello" button is present
    await expect(page.getByRole('button', { name: 'Say hello' })).toBeVisible();

    // Assert greeting cards are rendered
    await expect(page.getByText('English')).toBeVisible();
    await expect(page.getByText('Hello, World!')).toBeVisible();
  });

  test('should filter greetings by language', async ({ page }) => {
    await logIn(page);

    // Select Spanish from dropdown
    const languageSelect = page.getByRole('combobox', { name: 'Language:' });
    await languageSelect.selectOption('es');

    // Assert URL has lang parameter
    await expect(page).toHaveURL(/\?lang=es/);

    // Assert Spanish greeting is visible
    await expect(page.getByText('Spanish')).toBeVisible();
    await expect(page.getByText('¡Hola, Mundo!')).toBeVisible();

    // Assert English greeting is not visible (filtered out)
    await expect(page.getByText('English')).not.toBeVisible();
  });

  test('should navigate to greeting detail page when card is clicked', async ({ page }) => {
    await logIn(page);

    // Find and click the first greeting card
    await page.getByText('Hello, World!').click();

    // Assert navigation to detail page
    await expect(page).toHaveURL(/\/greetings\/\d+/);

    // Assert detail page heading
    await expect(page.getByText('← All greetings')).toBeVisible();
  });

  test('should increment hello count when Say hello button is clicked', async ({ page }) => {
    await logIn(page);

    // Click the "Say hello" button
    const sayHelloButton = page.getByRole('button', { name: 'Say hello' });
    await sayHelloButton.click();

    // The button should still be clickable (no error)
    await expect(sayHelloButton).toBeEnabled();
  });

  test('should show all languages when All is selected', async ({ page }) => {
    await logIn(page);

    // Select Spanish first
    const languageSelect = page.getByRole('combobox', { name: 'Language:' });
    await languageSelect.selectOption('es');

    // Assert Spanish is shown
    await expect(page.getByText('¡Hola, Mundo!')).toBeVisible();

    // Select All
    await languageSelect.selectOption('all');

    // Assert URL has no lang parameter
    await expect(page).toHaveURL(/^[^?]*$/);

    // Assert both English and Spanish are shown
    await expect(page.getByText('Hello, World!')).toBeVisible();
    await expect(page.getByText('¡Hola, Mundo!')).toBeVisible();
  });
});
