import { test, expect } from '@playwright/test'
import { goToGamePage, installFastRaceTiming } from './helpers/raceApp'

test.beforeEach(async ({ page }) => {
  await installFastRaceTiming(page)
  await goToGamePage(page)
})

test('starts, pauses, and resumes the race without timing flakes', async ({ page }) => {
  const startRaceButton = page.getByRole('button', { name: 'Start Race' })
  const pauseRaceButton = page.getByRole('button', { name: 'Pause Race' })

  await expect(startRaceButton).toBeVisible()
  await expect(pauseRaceButton).toBeDisabled()

  await startRaceButton.click()

  await expect(page.getByRole('button', { name: 'Start New Race' })).toBeVisible()
  await expect(pauseRaceButton).toBeEnabled()
  await expect(page.getByText('Status: Running')).toBeVisible()

  await pauseRaceButton.click()
  await expect(page.getByRole('button', { name: 'Continue Race' })).toBeVisible()
  await expect(page.getByText('Status: Ready')).toBeVisible()

  await page.getByRole('button', { name: 'Continue Race' }).click()
  await expect(page.getByRole('button', { name: 'Pause Race' })).toBeVisible()
  await expect(page.getByText('Status: Running')).toBeVisible()
})

test('restarts cleanly when starting a new race mid-run', async ({ page }) => {
  const startRaceButton = page.getByRole('button', { name: 'Start Race' })
  const pauseRaceButton = page.getByRole('button', { name: 'Pause Race' })

  await startRaceButton.click()
  await expect(page.getByRole('button', { name: 'Start New Race' })).toBeVisible()
  await expect(pauseRaceButton).toBeEnabled()
  await expect(page.getByText('Status: Running')).toBeVisible()

  await pauseRaceButton.click()
  await expect(page.getByRole('button', { name: 'Continue Race' })).toBeVisible()
  await expect(page.getByText('Status: Ready')).toBeVisible()

  await page.getByRole('button', { name: 'Start New Race' }).click()
  await expect(page).toHaveURL(/\/game$/)
  await expect(page.getByRole('button', { name: 'Pause Race' })).toBeEnabled()
  await expect(page.getByRole('button', { name: 'Continue Race' })).toHaveCount(0)
  await expect(page.getByText('Status: Running')).toBeVisible()
  await expect(page.getByTestId('round-card-completed')).toHaveCount(0)
})
