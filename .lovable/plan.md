## Scope (simplified per your feedback)

Two small changes — no full chat system, just wire up the navigation and swap in real Google Maps.

### 1. Messages page (just a destination for "Go to Messages")

- **New route `src/routes/messages.tsx`** — a simple inbox screen:
  - AppShell with header "Messages"
  - List of message threads, one per firm from `FIRMS` (firm logo/initial, name, engineer, last-message preview, time, unread dot)
  - Tapping a row goes to `/firm/$id` (no separate thread view needed for this prototype)
  - Empty-state friendly styling that matches the dark/orange theme
- **Hook up Confirmation's "Go to Messages" button** → `navigate({ to: "/messages" })`.
- **Hook up the bottom-nav chat icon** in `AppShell` → `/messages`.
- No store changes, no real chat composer — threads are static seed data.

### 2. Real Google Maps on the home screen

- **New component `src/components/falcon/GoogleMap.tsx`** — port the original component:
  - Loads Maps JS API async via the Lovable Google Maps connector browser key
    (`VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY` + `&channel=…TRACKING_ID`, `loading=async&callback=initFalconMap`)
  - Applies a dark navy style so it matches the Falcon theme
  - Uses `google.maps.Marker` with an orange circle symbol per firm (no `mapId`, no AdvancedMarkerElement)
  - Centered on Davao (`7.0731, 125.6128`), zoom 13
  - Clicking a marker calls `onMarkerClick(id)`
- **Connect** the `google_maps` connector so the key env vars are injected.
- **Swap** `src/routes/index.tsx` to use the new `GoogleMap` instead of `FalconMap`. `FalconMap.tsx` stays as a silent fallback if the script fails to load.

### Out of scope

- Real chat messages, composer, persistence, notifications.
- Geocoding / directions / Places search.
- Any change to the booking form flow itself (it already navigates correctly to Confirmation).
