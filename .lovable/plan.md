## What we're building

A faithful port of the "Falcon Geosolutions" mobile-first app from `WENDELL509/Falcon-` into this project. It's a directory of surveying firms in Davao City with 4 screens:

1. **/** — Map search (Google-Maps-style view with orange pins + bottom sheet listing firms, filter chips: Property Boundary, Land Division, Land Titling, Specialized, GIS)
2. **/firm/:id** — Firm profile (business card header, contact info, survey-type picker grouped into 4 categories, "Book a Request" CTA)
3. **/firm/:id/book** — Booking form (multi-field request form with validation)
4. **/confirmation** — "Thank you for using Falcon" success screen
5. **404** — Not found

Shared `AppShell` wraps every screen with the dark mobile frame and a bottom nav (Home / Chat / Search / Check / Menu).

## Design system

Port the original Falcon design tokens into `src/styles.css` (converted from HSL to oklch as required by the template):

- Deep navy background (`#0e1729`-ish) with warm off-white text
- Vibrant orange primary (`#ff6a1a`) + deep red accent (the falcon-wing red)
- Gradient utilities (`gradient-primary`, `gradient-surface`), elegant shadows, pin-pop / pulse-ring / fade-up keyframes
- Display font "Horizon" (falls back to Impact/Oswald/Bebas Neue), body Montserrat, secondary Poppins (via Google Fonts)
- `.mobile-frame` wrapper centers content at 440px max-width

Add the Falcon logo (`falcon-logo.jpg` from the repo) to `src/assets/` and use it in the `Logo` component and confirmation screen.

## Routing port

- Replace `react-router-dom` patterns with TanStack Start file routes:
  - `src/routes/index.tsx` → MapSearch
  - `src/routes/firm.$id.tsx` → FirmProfile
  - `src/routes/firm.$id.book.tsx` → BookingForm
  - `src/routes/confirmation.tsx` → Confirmation
- Replace `<Link to>` / `useNavigate` / `useParams` with TanStack equivalents
- `__root.tsx` keeps the existing shell; wrap `<Outlet/>` in the AppShell mobile frame + bottom nav
- Add per-route `head()` with proper titles/descriptions (single H1 per page)

## Data

The firm list is the static `FIRMS` array from `MapSearch.tsx` (11 firms — 4 originals + 7 from `plan.md`) with `category`, `services`, lat/lng, and ratings. No backend needed; booking submission just navigates to `/confirmation` and shows a sonner toast (same as original).

## Map

The original uses a stylized SVG/CSS "GoogleMap" component (not the real Google Maps SDK — no API key). I'll port that as-is so there are no external dependencies or keys to configure.

## Components to port

From the repo, ported to TanStack/Tailwind v4:
- `AppShell.tsx`, `Logo.tsx`, `GoogleMap.tsx`, `NavLink.tsx`
- `pages/MapSearch.tsx`, `pages/FirmProfile.tsx`, `pages/BookingForm.tsx`, `pages/Confirmation.tsx`, `pages/NotFound.tsx`
- `lib/booking.ts` (zod schema for the booking form)

Shadcn UI primitives (button, card, input, textarea, badge, sonner, etc.) already exist in this project — reuse them.

## Out of scope

- The PDF you also uploaded shows the same 4 screens as design reference — I'll use it to validate visuals but won't add anything that isn't already in the repo code (e.g. no real Google Maps SDK, no chat feature, no backend).
- No tests are ported (the repo only has one example test).
- No auth / Lovable Cloud — the original is fully static.

## Technical notes

- Tailwind v3 → v4: tokens move from `tailwind.config.ts` `colors:` extend to `@theme inline` + `:root` in `src/styles.css`. HSL values converted to `oklch()`.
- `lovable-tagger`, `tailwindcss-animate`, and `next-themes` from the repo aren't needed — `tw-animate-css` is already imported and the app is dark-only.
- Bottom nav icons use existing `lucide-react`.
