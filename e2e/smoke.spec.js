// @ts-check
const { test, expect } = require('@playwright/test');
const { selectors, firstQuestion } = require('./fixtures/test-data');

/**
 * Smoke Tests for FinProms App
 *
 * These tests verify the most critical user paths work correctly.
 * They should run quickly and catch any major regressions.
 */

test.describe('Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to ensure clean state
    await page.addInitScript(() => {
      window.localStorage.clear();
    });
  });

  test('ST-001: App loads successfully', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Verify welcome screen is visible
    await expect(page.locator('.hero-section')).toBeVisible();

    // Verify the main heading is present
    await expect(page.locator('h1')).toContainText(/Future-Proofing Compliance|MEMA/i);

    // Verify start button is present and visible (could be "Begin Assessment Now" or "Get Started")
    const startButton = page.locator('.start-button').first();
    await expect(startButton).toBeVisible();

    // Verify the page title is set correctly
    await expect(page).toHaveTitle(/MEMA|Financial Promotions|Compliance/i);

    // Verify key value propositions are visible (using first() to avoid strict mode violation)
    await expect(page.locator('text=Streamlined Workflows').first()).toBeVisible();
    await expect(page.locator('text=Actionable Insights').first()).toBeVisible();
    await expect(page.locator('text=Reduced Risk Exposure').first()).toBeVisible();
  });

  test('ST-002: Start assessment flow', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Click the start button (uses .start-button class)
    const startButton = page.locator('.start-button').first();
    await startButton.click();

    // Wait for the questionnaire to load
    await page.waitForLoadState('networkidle');

    // Verify questionnaire appears
    const questionCard = page.locator('.assessment-question-card');
    await expect(questionCard).toBeVisible({ timeout: 10000 });

    // Verify first question is shown
    const questionText = page.locator('.assessment-question-card h3');
    await expect(questionText).toBeVisible();

    // Verify the question text contains expected content (first question)
    await expect(questionText).toContainText(/invitation or inducement/i);

    // Verify answer options are present (Yes/No for first question)
    const answerButtons = page.locator('.answer-toggle');
    await expect(answerButtons).toHaveCount(2);
    await expect(page.locator('.answer-toggle').filter({ hasText: 'Yes' })).toBeVisible();
    await expect(page.locator('.answer-toggle').filter({ hasText: 'No' })).toBeVisible();

    // Verify question reference is shown
    await expect(page.locator('.question-reference')).toContainText('PERG');

    // Verify navigation buttons are present
    await expect(page.locator('button').filter({ hasText: 'Previous' })).toBeVisible();
    await expect(page.locator('button').filter({ hasText: 'Next' })).toBeVisible();

    // Verify notes field is present
    await expect(page.locator('.notes-field textarea')).toBeVisible();

    // Verify progress bar is visible
    await expect(page.locator('.progress-bar')).toBeVisible();
  });

  test('ST-003: Basic navigation - answer question and click next', async ({ page }) => {
    // Navigate to the app and start assessment
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const startBtn = page.locator('.start-button').first();
    await startBtn.click();

    // Wait for questionnaire to load
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.assessment-question-card')).toBeVisible({ timeout: 10000 });

    // Get initial question text
    const initialQuestionText = await page.locator('.assessment-question-card h3').textContent();

    // Click "Yes" answer
    const yesButton = page.locator('.answer-toggle').filter({ hasText: 'Yes' });
    await yesButton.click();

    // Verify answer is selected (data-selected attribute should be "true")
    await expect(yesButton).toHaveAttribute('data-selected', 'true');

    // Click "Next" button
    const nextButton = page.locator('button').filter({ hasText: 'Next' });
    await nextButton.click();

    // Wait for navigation
    await page.waitForTimeout(500);

    // Verify progress has been updated
    // The question should have changed
    const newQuestionText = await page.locator('.assessment-question-card h3').textContent();
    expect(newQuestionText).not.toBe(initialQuestionText);

    // Verify we're on question 2 (check the step indicator)
    await expect(page.locator('.meta-pill.accent')).toContainText('Step 2');

    // Verify "Previous" button is now enabled (not visually disabled)
    const prevButton = page.locator('button').filter({ hasText: 'Previous' });
    await expect(prevButton).not.toHaveAttribute('disabled');

    // Click Previous to go back and verify answer is preserved
    await prevButton.click();
    await page.waitForTimeout(500);

    // Verify we're back on question 1
    await expect(page.locator('.meta-pill.accent')).toContainText('Step 1');

    // Verify the "Yes" answer is still selected
    const yesButtonAgain = page.locator('.answer-toggle').filter({ hasText: 'Yes' });
    await expect(yesButtonAgain).toHaveAttribute('data-selected', 'true');
  });
});
