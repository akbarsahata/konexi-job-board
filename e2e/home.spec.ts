import { test, expect } from './fixtures';

test.describe('Home Page', () => {
  test('should load the home page successfully', async ({ page }) => {
    await page.goto('/');

    // Check if the page loads
    await expect(page).toHaveTitle('Konexi JobBoard');

    // Check if main elements are present
    await expect(page.locator('h1')).toContainText('Browse Jobs');
    await expect(
      page.locator('text=Discover amazing opportunities')
    ).toBeVisible();

    // Check if header is present
    await expect(page.locator('header')).toBeVisible();

    // Check if navigation links are present
    await expect(page.locator('a[href="/login"]')).toBeVisible();
    await expect(page.locator('a[href="/signup"]')).toBeVisible();
  });

  test('should display job listings or empty state', async ({ page }) => {
    await page.goto('/');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Should either show jobs or empty state
    const jobsContainer = page.locator('div[class*="grid"]').nth(1);
    const emptyState = page.locator('text=No jobs found');

    // One of these should be visible
    const hasJobs = await jobsContainer.isVisible();
    const hasEmptyState = await emptyState.isVisible();

    expect(hasJobs || hasEmptyState).toBeTruthy();
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');

    await page.click('a[href="/login"]');
    await expect(page).toHaveURL('/login');
  });
});
