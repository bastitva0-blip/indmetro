# IndMetro

**India's unified metro companion app** — all 21 metro systems, one PWA.

Live at [indmetro.in](https://indmetro.in)

---

## What it does

IndMetro gives metro riders across India three things the official apps don't:

- **Next train** — real-time simulated arrivals based on each city's headway and schedule
- **Fare calculator** — city-specific slab systems and smart card discounts, correct per operator
- **Route planner** — step-by-step board/travel/interchange/alight instructions

Plus: nearest station finder (GPS), local landmarks, crowd simulation, balance tracker, offline support, and Journey Mode (live countdown to your stop).

No accounts. No ads. No backend. Everything runs on-device.

---

## Cities

| # | City | Status |
|---|------|--------|
| 1 | Lucknow | ✅ Live |
| 2 | Kanpur | 🔧 WIP |
| 3 | Agra | 🔧 WIP |
| 4 | Jaipur | 🔧 WIP |
| 5 | Kochi | 🔧 WIP |
| 6 | Navi Mumbai | 🔧 WIP |
| 7 | Gurgaon | 🔧 WIP |
| 8 | Patna | 🔧 WIP |
| 9 | Indore | 🔧 WIP |
| 10 | Bhopal | 🔧 WIP |
| 11 | Nagpur | 🔧 WIP |
| 12 | Pune | 🔧 WIP |
| 13 | Ahmedabad | 🔧 WIP |
| 14 | Noida | 🔧 WIP |
| 15 | Bangalore | 🔧 WIP |
| 16 | Chennai | 🔧 WIP |
| 17 | Hyderabad | 🔧 WIP |
| 18 | Kolkata | 🔧 WIP |
| 19 | Mumbai | 🔧 WIP |
| 20 | Delhi | 🔧 WIP |
| 21 | Meerut | 🔧 WIP |

---

## Getting started

```bash
npm install
npm run dev      # http://localhost:5000
npm run build    # production build → dist/
npm run preview  # preview production build
```

---

## Project structure

```
src/
├── cities/             One folder per city (metroData, fareData, segmentTimings, timetable, localPlaces, geojson)
├── components/         Shared UI — CityApp, map, route planner, dialogs, Journey Mode
│   └── ui/             Radix-based primitives (button, dialog, select, …)
├── contexts/           SmartCardContext (per-city, namespaced in localStorage)
├── hooks/              use-geolocation, use-mobile, use-online-status, use-install-prompt
├── lib/                routePlanner, trainSimulation, nearestStation, friendsJourney, utils
└── pages/              City route pages (/lucknow, /delhi, …) + city picker home + NotFound
```

Each city is a thin config object passed into the shared `CityApp` component — adding a new city is a data task, not a UI rewrite.

### localStorage namespacing

All keys are prefixed: `indmetro:<cityslug>:<key>`
e.g. `indmetro:lucknow:hasSmartCard`, `indmetro:delhi:cardBalance`

---

## Data notes

- **Timetables**: Generated from each city's documented headways and operating hours. Segment times are calibrated to match official end-to-end runtimes. Swap in a real departure spreadsheet by editing only `timetable.ts` for that city — no UI changes needed.
- **Fare slabs**: City-specific. Each city's `fareData.ts` encodes the correct operator slab table and smart card discount.
- **Route geometry**: `metroRoutes.geojson` per city uses straight segments between stations. Replace with OSM-traced alignment for accurate map curvature.
- **WIP lines**: Stations under construction carry an `isWIP` flag. Flipping a line to operational is a data change, not a code change.

---

## Tech stack

- React 18 + TypeScript + Vite
- `vite-plugin-pwa` — offline, service worker, installable
- Leaflet + OpenStreetMap — interactive maps, 30-day tile caching
- Tailwind CSS + Radix UI + shadcn/ui
- Vaul — bottom sheet drawers
- React Router DOM — `/lucknow`, `/delhi`, etc.

---

## Deployment

Configured for Vercel (`vercel.json`: security headers, asset caching, SPA fallback).  
Any static host works — `npm run build` outputs to `dist/`.

Play Store distribution via TWA (Trusted Web Activity) using `bubblewrap`.

---

## History

IndMetro evolved from **LkoMetro** (`lucknowmetro.in`) — a single-city Lucknow companion app — into a unified platform covering all 21 Indian metro systems under one PWA.

---

*Independent project. Not affiliated with UPMRC, DMRC, BMRCL, or any metro authority.*  
*Built by [Astitva Bhardwaj](https://www.linkedin.com/in/astitva-bhardwajlu/)*
