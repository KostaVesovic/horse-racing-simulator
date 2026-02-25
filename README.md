# Horse Race Simulator

A small Vue 3 + Pinia app that simulates multi-round horse races.
It generates horses, builds a 6-round race schedule, animates race progress, and shows final placements.

## Core elements

- Routing with `vue-router`:
  - `/` landing page
  - `/game` race simulation page
  - `/results` final results page
- Global race state with Pinia (`src/stores/appStore.js`)
- Race engine helpers:
  - `src/helpers/raceData.js` (horse/schedule generation)
  - `src/helpers/raceEngine.js` (tick progression and round result updates)
- Main UI components:
  - `RaceAnimation` for live race lanes
  - `RaceProgram` for round cards and placements
  - `HorseList` for the full horse roster sidebar

## Local setup

### 1) Install dependencies

```bash
npm install
```

### 2) Run in development

```bash
npm run dev
```

This starts Vite and opens the app in your browser.

### 3) Build for production

```bash
npm run build
```

### 4) Preview production build locally

```bash
npm run preview
```

## Testing

Unit tests are set up with Vitest + JSDOM and Vue Test Utils.

### Run tests once

```bash
npm run test:run
```

### Run tests in watch mode

```bash
npm run test:watch
```

### Run Vitest interactive mode

```bash
npm run test
```

### End-to-end tests (Playwright)

Playwright e2e specs live in `e2e/` and cover the core user flows:

- Landing -> Game navigation
- Race controls (start / pause / resume)
- Race completion -> Results -> Back to Start
- Edge case: starting a new race while a race is already running

Install Playwright browsers (first time only):

```bash
npx playwright install chromium
```

Run e2e tests:

```bash
npm run test:e2e
```

Run e2e tests in headed mode:

```bash
npm run test:e2e:headed
```

Run e2e tests with Playwright UI:

```bash
npm run test:e2e:ui
```

Notes:

- The e2e suite speeds up race timing using a test-only runtime override injected by Playwright (`window.__E2E_RACE_TIMING__`).

## Scripts

- `npm run dev` - start local dev server
- `npm run build` - create production build
- `npm run preview` - preview production build
- `npm run test` - run Vitest interactive mode
- `npm run test:run` - run Vitest once
- `npm run test:watch` - run Vitest in watch mode
- `npm run test:e2e` - run Playwright e2e tests
- `npm run test:e2e:headed` - run Playwright e2e tests with browser UI
- `npm run test:e2e:ui` - open Playwright UI mode
- `npm run lint` - run ESLint
- `npm run lint:fix` - auto-fix lint issues when possible
