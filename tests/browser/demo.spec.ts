import { test, expect } from '@playwright/test';
test('current testnet is the default and its controls fit desktop and mobile', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Your Squeeks. Right here.' })).toBeVisible();
  await expect(
    page.getByText('Recorded verified testnet snapshot', { exact: false }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Read portfolio', exact: true })).toBeEnabled();
  await page.getByLabel('Current testnet owner', { exact: true }).fill('invalid');
  await page.getByRole('button', { name: 'Read portfolio', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('valid, full Ethereum address');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});
test('overview labels its recorded data and fits the viewport', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await page.getByRole('button', { name: 'Overview', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'A little hamster. A whole lot to build.' }),
  ).toBeVisible();
  await expect(page.getByText('Saved public evidence, not live activity')).toBeVisible();
  await expect(page.getByText('Configuration changed', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.getByText('Inspect deployment evidence', { exact: true }).click();
  await expect(page.getByText('core.configuration.reporter', { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});
test('merge lab explains irreversible effects and disables ineligible actions', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Wallet lab', exact: true }).click();
  await expect(page.getByText('These two invented Squeeks', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Preview outcome', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('#256 will be burned permanently');
  await page.getByRole('button', { name: 'Swap roles', exact: true }).click();
  await page.getByRole('button', { name: 'Preview outcome', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('#128 will be burned permanently');
  for (const label of ['Cooling down', 'Pending power']) {
    await page.getByRole('button', { name: label, exact: true }).click();
    await expect(page.getByRole('button', { name: 'Preview outcome', exact: true })).toBeDisabled();
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});
test('bad addresses are rejected without reaching the network', async ({ page }) => {
  const network: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('publicnode.com')) network.push(request.url());
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Wallet lab', exact: true }).click();
  await page.getByRole('button', { name: 'Onchain inspection', exact: true }).click();
  await page.getByLabel('Owner address', { exact: true }).fill('invalid');
  await page.getByRole('button', { name: 'Inspect IDs', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('valid, full Ethereum address');
  expect(network).toEqual([]);
});
test('MCP catalog and quickstart navigation are complete', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /^MCP tools/ }).click();
  await expect(page.locator('.tool-row')).toHaveCount(19);
  await page.getByLabel('Operation').selectOption('check_api_compatibility');
  await expect(page.locator('.code').first()).toContainText('check_api_compatibility');
  await page.getByRole('button', { name: 'Quickstart', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'From clone to curiosity.' })).toBeVisible();
  await expect(
    page.getByText('The packages are not yet published to npm.', { exact: false }),
  ).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});
