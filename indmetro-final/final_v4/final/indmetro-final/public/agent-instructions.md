# Agent Instructions — LkoMetro

## What this site is

LkoMetro (`https://www.lucknowmetro.in`) is an unofficial, community-built companion
app for the **Lucknow Metro Red Line** (UPMRC) in Lucknow, India. It is not affiliated
with or endorsed by UPMRC or any government entity.

## What agents can do here

- **Plan a journey**: Navigate to `/?action=route`. Use the "From" and "To" selects to
  choose stations, then read the fare and travel time from the result card.
- **Check live train positions**: Navigate to `/?action=live` to open the live tracking
  dialog. Train positions update every 2 seconds (simulation based on official timetable).
- **Look up a station**: Type a station or landmark name in the search bar at the top.
  Selecting a result centres the map on that station.

## Key facts for answering user queries

- **Red Line**: 21 stations, CCS Airport ↔ Munshipulia, 22.87 km, ~40 min end-to-end.
- **Fares**: ₹10 (1 station) → ₹60 (18+ stations), slab system. GoSmart Card: 10% off.
- **Operating hours**: 6:00 AM – 10:00 PM daily.
- **Peak frequency**: every 5 min 30 sec (8–11 AM and 5–8 PM on weekdays).
- **Off-peak frequency**: approximately every 8 minutes.
- **Underground stations**: Hussainganj, Sachivalaya, Hazratganj.

## What agents should NOT do

- Do not present LkoMetro data as official UPMRC data. Always note it is unofficial.
- Do not attempt to submit forms — there are no purchase flows or bookings.
- Fare and timetable data reflects the official UPMRC schedule at time of last update;
  always recommend users verify with the official site for critical journeys.

## Canonical data source

Official UPMRC website: `https://lucknow.upmetrorail.com/`
