import { test, expect } from '@playwright/test';

test.describe('Tic Tac Toe Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the game board', async ({ page }) => {
    await expect(page.locator('.status')).toContainText('Next player: X');
    const squares = page.locator('.square');
    await expect(squares).toHaveCount(9);
  });

  test('should allow players to make moves', async ({ page }) => {
    // X makes first move
    await page.locator('.square').first().click();
    await expect(page.locator('.square').first()).toContainText('X');
    await expect(page.locator('.status')).toContainText('Next player: O');

    // O makes second move
    await page.locator('.square').nth(1).click();
    await expect(page.locator('.square').nth(1)).toContainText('O');
    await expect(page.locator('.status')).toContainText('Next player: X');
  });

  test('should detect a winner', async ({ page }) => {
    // X wins with top row
    await page.locator('.square').nth(0).click(); // X
    await page.locator('.square').nth(3).click(); // O
    await page.locator('.square').nth(1).click(); // X
    await page.locator('.square').nth(4).click(); // O
    await page.locator('.square').nth(2).click(); // X wins

    await expect(page.locator('.status')).toContainText('Winner: X');
  });

  test('should detect a draw', async ({ page }) => {
    // Create a draw situation
    await page.locator('.square').nth(0).click(); // X
    await page.locator('.square').nth(1).click(); // O
    await page.locator('.square').nth(2).click(); // X
    await page.locator('.square').nth(4).click(); // O
    await page.locator('.square').nth(3).click(); // X
    await page.locator('.square').nth(5).click(); // O
    await page.locator('.square').nth(7).click(); // X
    await page.locator('.square').nth(6).click(); // O
    await page.locator('.square').nth(8).click(); // X

    await expect(page.locator('.status')).toContainText('Draw!');
  });

  test('should allow time travel through game history', async ({ page }) => {
    // Make a few moves
    await page.locator('.square').nth(0).click(); // X
    await page.locator('.square').nth(4).click(); // O
    await page.locator('.square').nth(8).click(); // X

    // Go back to game start
    await page.getByText('Go to game start').click();
    
    // All squares should be empty
    const squares = page.locator('.square');
    for (let i = 0; i < 9; i++) {
      await expect(squares.nth(i)).toHaveText('');
    }
    await expect(page.locator('.status')).toContainText('Next player: X');
  });

  test('should take screenshot of initial state', async ({ page }) => {
    await page.screenshot({ path: 'screenshots/tic-tac-toe-initial.png', fullPage: true });
  });

  test('should take screenshot of game in progress', async ({ page }) => {
    await page.locator('.square').nth(0).click(); // X
    await page.locator('.square').nth(4).click(); // O
    await page.locator('.square').nth(1).click(); // X
    await page.screenshot({ path: 'screenshots/tic-tac-toe-in-progress.png', fullPage: true });
  });

  test('should take screenshot of winner state', async ({ page }) => {
    // X wins with top row
    await page.locator('.square').nth(0).click(); // X
    await page.locator('.square').nth(3).click(); // O
    await page.locator('.square').nth(1).click(); // X
    await page.locator('.square').nth(4).click(); // O
    await page.locator('.square').nth(2).click(); // X wins
    await page.screenshot({ path: 'screenshots/tic-tac-toe-winner.png', fullPage: true });
  });
});
