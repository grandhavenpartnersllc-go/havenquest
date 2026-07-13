import { NextResponse } from 'next/server'

// POST /api/portal/amy — STUB (Ask Amy Part 1 shell).
//
// Ask Amy's free-form Q&A is deferred to Phase 3: the classify-then-answer guardrail must be
// built and hard-tested first, and the signed compliance attestation requires factual /
// educational answers only, with all judgment/advice handed to a licensed Market Director.
// Until then this route wires NO Anthropic call and simply reports that free-form answering is
// not enabled. The Part 1 shell never calls this endpoint (the free-form box is disabled) — it
// exists only as the client/server seam for Phase 3.
export async function POST() {
  return NextResponse.json(
    { enabled: false, message: 'Ask Amy free-form answering is not enabled yet.' },
    { status: 200 },
  )
}
