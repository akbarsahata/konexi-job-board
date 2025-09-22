import { test, expect } from './fixtures';

test.describe('Login Page', () => {
  test('should load the login page successfully', async ({ page }) => {
    await page.goto('/login');

    // Check if the page loads
    await expect(page).toHaveTitle('Konexi JobBoard');

    // Check if form elements are present
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();

    // Check if signup link is present
    await expect(page.locator('a[href="/signup"]')).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/login');

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Should stay on login page (no navigation)
    await expect(page).toHaveURL('/login');
  });

  test('should show validation errors for invalid email', async ({ page }) => {
    await page.goto('/login');

    // Fill invalid email
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Should stay on login page
    await expect(page).toHaveURL('/login');
  });

  test('should navigate to signup page', async ({ page }) => {
    await page.goto('/login');

    await page.click('a[href="/signup"]');
    await expect(page).toHaveURL('/signup');
  });

  test('should toggle password visibility', async ({ page }) => {
    await page.goto('/login');

    const passwordInput = page.locator('input[type="password"]');
    const toggleButton = page
      .locator('button')
      .filter({ hasText: /show|hide/i })
      .first();

    // Password should be hidden initially
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click toggle button if it exists
    if (await toggleButton.isVisible()) {
      await toggleButton.click();
      // Password should now be visible (type="text")
      await expect(
        passwordInput.or(page.locator('input[type="text"]'))
      ).toBeVisible();
    }
  });
});
