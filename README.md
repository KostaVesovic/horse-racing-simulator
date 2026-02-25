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

## Scripts

- `npm run dev` - start local dev server
- `npm run build` - create production build
- `npm run preview` - preview production build
- `npm run lint` - run ESLint
- `npm run lint:fix` - auto-fix lint issues when possible
