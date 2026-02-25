import { expect } from '@playwright/test'

export const installFastRaceTiming = async (page) => {
  await page.addInitScript(() => {
    window.__E2E_RACE_TIMING__ = {
      tickMs: 10,
      nextRoundDelayMs: 10,
      countdownStart: 1,
      countdownIntervalMs: 10
    }
  })
}

export const goToGamePage = async (page) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Horse Race Simulator' })).toBeVisible()
  await page.getByRole('button', { name: 'Generate Program' }).click()
  await expect(page).toHaveURL(/\/game$/)
  await expect(page.getByRole('heading', { name: 'Race Program' })).toBeVisible()
}
