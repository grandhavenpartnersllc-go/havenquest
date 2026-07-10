// Client helper for the MM3 activity-events pipe (invisible foundation).
//
// logActivityEvent POSTs a single high-signal MM3 event to /api/portal/activity, where the
// server derives user_email from the authenticated hq_auth session. Errors are swallowed
// silently -- activity logging must NEVER break or block a user interaction.
//
// IMPORTANT: this helper currently has ZERO call sites by design. Instrumentation lands in
// later briefs (the canvas and confirm-gate briefs). Emissions must not reach real prospects
// before the Phase 4 consent/disclosure review -- any brief that wires this up must gate the
// call behind that review (or a feature flag).
export async function logActivityEvent(
  eventType: string,
  payload: Record<string, unknown> = {},
): Promise<void> {
  try {
    await fetch('/api/portal/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ event_type: eventType, payload }),
    })
  } catch {
    // Swallow: logging must never surface an error to the user.
  }
}
