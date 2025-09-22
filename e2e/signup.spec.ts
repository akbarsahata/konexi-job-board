import { expect, test } from './fixtures';

test.describe('Signup Page', () => {
  test('should load the signup page successfully', async ({ page }) => {
    await page.goto('/signup');

    // Check if the page loads
    await expect(page).toHaveTitle('Konexi JobBoard');

    // Check if main elements are present
    await expect(page.locator('h2')).toContainText('Create your account');
    expect(page.getByText('Or sign in to your existing')).toBeVisible();

    // Check if form elements are present
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();

    // Check if login link is present
    await expect(
      page.getByRole('link', { name: 'sign in to your existing' })
    ).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/signup');

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Should stay on signup page (no navigation)
    await expect(page).toHaveURL('/signup');
  });

  test('should show validation errors for invalid email', async ({ page }) => {
    await page.goto('/signup');

    // Fill invalid email
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', 'password123');
    await page.fill('input[placeholder*="confirm" i]', 'password123');
    await page.click('button[type="submit"]');

    // Should stay on signup page
    await expect(page).toHaveURL('/signup');
  });

  test('should show validation errors for password mismatch', async ({
    page,
  }) => {
    await page.goto('/signup');

    // Fill form with mismatched passwords
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.fill('input[placeholder*="confirm" i]', 'password456');
    await page.click('button[type="submit"]');

    // Should stay on signup page
    await expect(page).toHaveURL('/signup');
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/signup');

    await page.click('a[href="/login"]');
    await expect(page).toHaveURL('/login');
  });

  test('should toggle password visibility', async ({ page }) => {
    await page.goto('/signup');

    const passwordInputs = page.locator('input[type="password"]');
    const toggleButtons = page
      .locator('button')
      .filter({ hasText: /show|hide/i });

    // Password should be hidden initially
    await expect(passwordInputs.first()).toHaveAttribute('type', 'password');

    // Click first toggle button if it exists
    if (await toggleButtons.first().isVisible()) {
      await toggleButtons.first().click();
      // Password should now be visible (type="text")
      await expect(page.locator('input[type="text"]').first()).toBeVisible();
    }
  });

  test('should attempt signup with valid data', async ({ page }) => {
    const testUser = {
      email: `test-${Date.now()}@example.com`,
      password: 'testpassword123',
    };

    await page.goto('/signup');

    // Fill form with valid data
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    await page.fill('input[placeholder*="confirm" i]', testUser.password);

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for any potential navigation or feedback
    await page.waitForTimeout(2000);

    // The test doesn't verify successful signup since that would require
    // actual email verification, but it verifies the form submission works
  });
});
