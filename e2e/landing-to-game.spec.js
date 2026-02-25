import { test, expect } from '@playwright/test'
import { installFastRaceTiming } from './helpers/raceApp'

test.beforeEach(async ({ page }) => {
  await installFastRaceTiming(page)
})

test('navigates from landing page to game page', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Horse Race Simulator' })).toBeVisible()
  await page.getByRole('button', { name: 'Generate Program' }).click()

  await expect(page).toHaveURL(/\/game$/)
  await expect(page.getByRole('button', { name: 'Start Race' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Race Program' })).toBeVisible()
  await expect(page.getByRole('heading', { name: /Round \d+/ })).toHaveCount(6)
})
