import { test, expect } from '@playwright/test'
import { goToGamePage, installFastRaceTiming } from './helpers/raceApp'

test.beforeEach(async ({ page }) => {
  await installFastRaceTiming(page)
  await goToGamePage(page)
})

test('completes a race and returns to start with reset results', async ({ page }) => {
  await page.getByRole('button', { name: 'Start Race' }).click()

  await expect(page).toHaveURL(/\/results$/, { timeout: 15000 })
  await expect(page.getByRole('heading', { name: 'Race Program' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Back to Start' })).toBeVisible()
  await expect(page.getByRole('heading', { name: /Round \d+/ })).toHaveCount(6)
  await expect(page.getByTestId('round-card-completed')).toHaveCount(6)

  const placeEntries = page.getByTestId('round-place')
  await expect(placeEntries).toHaveCount(60)

  const placeTexts = await placeEntries.allTextContents()
  expect(placeTexts.includes('Place: -')).toBe(false)
  const places = placeTexts.map((text) => Number(text.replace('Place: ', '')))

  expect(places.every(Number.isInteger)).toBe(true)
  for (let place = 1; place <= 10; place += 1) {
    expect(places.filter((value) => value === place)).toHaveLength(6)
  }

  await page.getByRole('button', { name: 'Back to Start' }).click()
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('heading', { name: 'Horse Race Simulator' })).toBeVisible()

  await page.getByRole('button', { name: 'Generate Program' }).click()
  await expect(page).toHaveURL(/\/game$/)
  const resetPlaceTexts = await page.getByTestId('round-place').allTextContents()
  expect(resetPlaceTexts).toHaveLength(60)
  expect(resetPlaceTexts.every((text) => text === 'Place: -')).toBe(true)
})
