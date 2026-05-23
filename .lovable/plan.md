# Plan

## 1. Fix the dead "Book a Request" button (`src/routes/firm.$id.tsx`)

The button is rendered as `fixed bottom-20` and sits behind the AppShell bottom nav / gradient overlays, so clicks don't register. Fix:

- Move the CTA out of `position: fixed` and into a sticky footer inside the scroll container (`sticky bottom-20 z-50`), or wrap it in a `pointer-events-auto` container with proper stacking above the bottom tab bar.
- Keep the same `onBook` handler (already wired to `bookingStore.set` + `navigate({ to: "/firm/$id/book", params: { id } })`) — no logic change needed, just make it clickable.
- Add extra bottom padding to the page content so the sticky CTA doesn't cover the last section.

(The uploaded `BookingForm.tsx` uses `react-router-dom` and an old store path — the current `firm.$id.book.tsx` already mirrors its content using TanStack Router + `@/lib/booking`, so no need to re-port that file. The fix is purely the parent firm page's CTA.)

## 2. Add Ratings & Feedback section to firm profile (`src/routes/firm.$id.tsx`)

Based on image-9, append a new section above the CTA on the firm profile page that shows:

- **Status tracker** — 4 stages (Received · Conduct Field · Processing · Done) with icons, rendered as a horizontal stepper using existing design tokens.
- **Rate** block — three rows (Punctuality, Professionalism, Service) each with an interactive 5-star control (lucide `Star`, toggled state, `text-primary fill-current` when active).
- **Feedback** block — a `Textarea` (shadcn) with a "Submit Feedback" button.

State is local (`useState` for each rating + feedback string); submit triggers a toast (`sonner`) — no backend wiring since user only asked for the UI to appear.

## Files touched
- `src/routes/firm.$id.tsx` — fix CTA positioning, add Status/Rate/Feedback sections.

## Out of scope
- Persisting ratings to a database.
- Restyling the booking form itself.
- Touching `AppShell`, route tree, or other pages.