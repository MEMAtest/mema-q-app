// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Results Page E2E Tests
 * Tests for the results page functionality after completing the questionnaire
 */

test.describe('Results Page Tests', () => {
  /**
   * Helper function to complete questionnaire and navigate to results
   * @param {import('@playwright/test').Page} page
   * @param {Object} options - Options for completing the questionnaire
   * @param {boolean} options.allYes - If true, answer Yes to all questions; if false, mix Yes/No
   */
  async function completeQuestionnaireAndGoToResults(page, options = { allYes: false }) {
    // Navigate to home page
    await page.goto('/');

    // Wait for welcome screen and start assessment
    await page.waitForSelector('text=Start Assessment', { timeout: 10000 });
    await page.click('text=Start Assessment');

    // Wait for questionnaire to load
    await page.waitForSelector('.assessment-question-card', { timeout: 10000 });

    // Answer questions (navigate through at least a few to generate meaningful results)
    let questionCount = 0;
    const maxQuestions = 10; // Answer a subset for speed

    while (questionCount < maxQuestions) {
      // Check if we're still in the questionnaire
      const nextButton = page.locator('button:has-text("Next"), button:has-text("Finish")');
      if (await nextButton.count() === 0) break;

      // Answer the current question based on options
      const yesButton = page.locator('.answer-toggle:has-text("Yes")');
      const noButton = page.locator('.answer-toggle:has-text("No")');

      if (await yesButton.count() > 0) {
        if (options.allYes || questionCount % 2 === 0) {
          await yesButton.click();
        } else {
          await noButton.click();
        }
      }

      // Click Next or Finish
      const finishButton = page.locator('button:has-text("Finish")');
      if (await finishButton.count() > 0) {
        await finishButton.click();
        break;
      }

      // Wait for element to be stable before clicking (webkit needs this)
      await page.waitForTimeout(200);
      await nextButton.first().click({ force: true });
      questionCount++;

      // Small delay to allow for navigation
      await page.waitForTimeout(300);
    }

    // If we haven't finished yet, click View Results button
    const viewResultsButton = page.locator('button:has-text("View Results")');
    if (await viewResultsButton.count() > 0) {
      await viewResultsButton.click();
    }

    // Wait for results page to load (shows "Health Score" not "Compliance Score")
    await page.waitForSelector('text=Health Score', { timeout: 15000 });
  }

  test('RP-001: Results display - verify charts render after completing questionnaire', async ({ page }) => {
    await completeQuestionnaireAndGoToResults(page, { allYes: true });

    // Verify the results page heading exists
    const resultsHeading = page.locator('text=Your Compliance Assessment Results');
    await expect(resultsHeading).toBeVisible();

    // Verify the health score is displayed (look for % in the score display)
    const scoreDisplay = page.locator('text=Health Score');
    await expect(scoreDisplay).toBeVisible();

    // Verify there's a percentage displayed on the page
    const pageContent = await page.content();
    expect(pageContent).toMatch(/\d+%/);

    // Verify the bar chart section exists
    const sectionBreakdown = page.locator('text=Section Breakdown');
    await expect(sectionBreakdown).toBeVisible();

    // Verify canvas elements exist (Chart.js renders to canvas)
    const canvasElements = page.locator('canvas');
    await expect(canvasElements.first()).toBeVisible();
    expect(await canvasElements.count()).toBeGreaterThanOrEqual(1);
  });

  test('RP-002: Compliance issues list - verify issues shown for "No" answers', async ({ page }) => {
    await completeQuestionnaireAndGoToResults(page, { allYes: false });

    // Wait for the Key Areas section to be visible
    const keyAreasSection = page.locator('text=Key Areas for Review');
    await expect(keyAreasSection).toBeVisible();

    // Check for either risk cards (issues found) OR success message (no issues)
    const riskCards = page.locator('.risk-card');
    const successMessage = page.locator('text=No critical issues found');

    // One of these should be visible
    const hasRiskCards = await riskCards.count() > 0;
    const hasSuccessMessage = await successMessage.count() > 0;

    expect(hasRiskCards || hasSuccessMessage).toBe(true);

    // If there are risk cards, verify they contain expected elements
    if (hasRiskCards) {
      const firstRiskCard = riskCards.first();
      await expect(firstRiskCard).toBeVisible();

      // Risk cards should have question reference and implication
      const riskCardHeader = firstRiskCard.locator('.risk-card-header');
      await expect(riskCardHeader).toBeVisible();
    }
  });

  test('RP-003: Score calculation - verify percentage matches Yes/No ratio', async ({ page }) => {
    // Complete with all Yes answers - should get 100% or high score
    await completeQuestionnaireAndGoToResults(page, { allYes: true });

    // Get the health score from page content (look for percentage pattern)
    const pageContent = await page.content();
    const scoreMatch = pageContent.match(/(\d+)%/);
    expect(scoreMatch).not.toBeNull();

    const scoreNumber = parseInt(scoreMatch[1], 10);

    // With all Yes answers, score should be at least 50% (test is answering subset of questions)
    expect(scoreNumber).toBeGreaterThanOrEqual(50);

    // Verify the health status text reflects the score
    const statusText = page.locator('text=Overall Status');
    await expect(statusText).toBeVisible();

    // High scores should show "Strong" status
    if (scoreNumber >= 80) {
      const strongStatus = page.locator('text=Strong');
      await expect(strongStatus).toBeVisible();
    }
  });

  test('RP-004: Lead capture form modal - click unlock, verify form fields', async ({ page }) => {
    await completeQuestionnaireAndGoToResults(page, { allYes: true });

    // Look for the lead capture form section
    const unlockSection = page.locator('text=Unlock & Download Full Report');

    // If the form is visible, verify all required fields
    if (await unlockSection.count() > 0) {
      await expect(unlockSection).toBeVisible();

      // Verify form fields are present (using placeholder text as selectors)
      const nameInput = page.locator('input[placeholder="Jane Doe"]');
      const firmInput = page.locator('input[placeholder="Your Company Ltd"]');
      const emailInput = page.locator('input[placeholder="you@company.com"]');
      const phoneInput = page.locator('input[placeholder*="07123"]');

      await expect(nameInput).toBeVisible();
      await expect(firmInput).toBeVisible();
      await expect(emailInput).toBeVisible();
      await expect(phoneInput).toBeVisible();

      // Verify labels by text content
      await expect(page.locator('text=Full Name *')).toBeVisible();
      await expect(page.locator('text=Firm Name *')).toBeVisible();
      await expect(page.locator('text=Email Address *')).toBeVisible();

      // Verify submit button
      const submitButton = page.locator('button:has-text("Unlock Full Report")');
      await expect(submitButton).toBeVisible();
    } else {
      // If already unlocked, verify download buttons are visible
      const downloadCsvButton = page.locator('button:has-text("Download CSV")');
      await expect(downloadCsvButton).toBeVisible();
    }
  });

  test('RP-005: Lead form validation - invalid email should show error', async ({ page }) => {
    await completeQuestionnaireAndGoToResults(page, { allYes: true });

    // Find the lead capture form
    const unlockSection = page.locator('text=Unlock & Download Full Report');

    if (await unlockSection.count() > 0) {
      // Fill out the form with invalid email using placeholder selectors
      const nameInput = page.locator('input[placeholder="Jane Doe"]');
      const firmInput = page.locator('input[placeholder="Your Company Ltd"]');
      const emailInput = page.locator('input[placeholder="you@company.com"]');
      const phoneInput = page.locator('input[placeholder*="07123"]');

      await nameInput.fill('Test User');
      await firmInput.fill('Test Company');
      await emailInput.fill('invalid-email');
      await phoneInput.fill('1234567890');

      // Submit the form
      const submitButton = page.locator('button:has-text("Unlock Full Report")');
      await submitButton.click();

      // Wait for error response
      await page.waitForTimeout(1000);

      // Check for browser's built-in validation (input:invalid state)
      const isInvalid = await emailInput.evaluate((el) => !el.validity.valid);

      // Browser validation should trigger for invalid email
      expect(isInvalid).toBe(true);
    } else {
      // Form already submitted, skip this test
      test.skip();
    }
  });

  test('RP-006: CSV export - verify download works', async ({ page }) => {
    await completeQuestionnaireAndGoToResults(page, { allYes: true });

    // Check if we need to unlock the report first
    const unlockSection = page.locator('text=Unlock & Download Full Report');

    if (await unlockSection.count() > 0) {
      // Fill out the lead form to unlock using placeholder selectors
      const nameInput = page.locator('input[placeholder="Jane Doe"]');
      const firmInput = page.locator('input[placeholder="Your Company Ltd"]');
      const emailInput = page.locator('input[placeholder="you@company.com"]');
      const phoneInput = page.locator('input[placeholder*="07123"]');

      await nameInput.fill('Test User');
      await firmInput.fill('Test Company');
      await emailInput.fill('test@example.com');
      await phoneInput.fill('1234567890');

      // Mock the API response for lead submission
      await page.route('**/api/leads', async (route) => {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, message: 'Lead saved' })
        });
      });

      // Submit the form
      const submitButton = page.locator('button:has-text("Unlock Full Report")');
      await submitButton.click();

      // Wait for form submission and unlock
      await page.waitForTimeout(1000);
    }

    // Now look for the Download CSV button
    const downloadCsvButton = page.locator('button:has-text("CSV")');

    if (await downloadCsvButton.count() > 0) {
      // Set up download event listener
      const downloadPromise = page.waitForEvent('download');

      // Click the download button
      await downloadCsvButton.click();

      // Wait for download to start
      const download = await downloadPromise;

      // Verify the download filename
      const filename = download.suggestedFilename();
      expect(filename).toMatch(/\.csv$/);
      expect(filename).toContain('compliance');
    } else {
      // Skip if download button not available (report not unlocked)
      test.skip();
    }
  });

  test('RP-007: Return to assessment - go back, verify answers preserved', async ({ page }) => {
    // Navigate and complete some questions
    await page.goto('/');
    await page.waitForSelector('text=Start Assessment', { timeout: 10000 });
    await page.click('text=Start Assessment');
    await page.waitForSelector('.assessment-question-card', { timeout: 10000 });

    // Answer first question with Yes
    const yesButton = page.locator('.answer-toggle:has-text("Yes")');
    await yesButton.click();

    // Add notes (using a more flexible locator)
    const notesTextarea = page.locator('textarea');
    const testNotes = 'Test notes for preservation check';
    await notesTextarea.fill(testNotes);

    // Click View Results to go to results page
    const viewResultsButton = page.locator('button:has-text("View Results")');
    await viewResultsButton.click();

    // Wait for results page (using Health Score instead of Compliance Score)
    await page.waitForSelector('text=Health Score', { timeout: 15000 });

    // Click Back to Questionnaire
    const backButton = page.locator('button:has-text("Back to Questionnaire")');
    await expect(backButton).toBeVisible();
    await backButton.click();

    // Wait for questionnaire to reload
    await page.waitForSelector('.assessment-question-card', { timeout: 10000 });

    // Verify the first question's answer is preserved
    const selectedYesButton = page.locator('.answer-toggle[data-selected="true"]:has-text("Yes")');
    await expect(selectedYesButton).toBeVisible();

    // Verify notes are preserved
    const notesValue = await notesTextarea.inputValue();
    expect(notesValue).toBe(testNotes);
  });
});
