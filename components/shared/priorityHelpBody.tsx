import type { ReactNode } from 'react'

// Body copy for the priority-control "How this works" popup (Brief INTAKE_THREE_CHANGES,
// CP3). VERBATIM — do not reword, paraphrase, or improve. Bold spans are exactly as marked
// in the brief.
//
// `includeMinOne` toggles the single Discovery-Intake-only paragraph ("Pick at least one Top
// priority…"). Per Craig's July 17 ruling: the intake enforces that gate so it passes true;
// MM3 does not enforce it (advance is gated by pin+confirm, not priorities) so it passes
// false. Every other line is identical on both surfaces.
export function buildPriorityHelpBody(includeMinOne: boolean): ReactNode {
  return (
    <>
      <p>
        Each row is one thing families weigh when they&apos;re choosing where to live.{' '}
        <strong>Drag its dot to the band that fits — or just tap the band.</strong> The further
        left, the more it matters to you.
      </p>
      <ul>
        <li><strong>Top priority</strong> — the few things you&apos;d actually move for</li>
        <li><strong>Really matters</strong> — important, but you could live without one</li>
        <li><strong>Nice to have</strong> — you&apos;d enjoy it; you don&apos;t need it</li>
        <li><strong>Not yet sorted</strong> — where every dot starts</li>
      </ul>

      <hr className="hq-help-rule" />

      {includeMinOne && (
        <p>
          <strong>Pick at least one Top priority.</strong>{' '}You can&apos;t move on without
          one — knowing what you&apos;d actually move for is the whole point.
        </p>
      )}

      <p>
        <strong>Three each, at the top.</strong> Top priority and Really matters hold three
        apiece. The limit is on purpose: almost everything matters to someone, and having to
        choose is what turns a wish list into real priorities. The two right-hand bands are
        unlimited.
      </p>

      <p>
        If a band is full, the dot won&apos;t stay there. Move something out first, or drop it
        one band over.
      </p>

      <p>
        Nothing&apos;s locked in — slide anything back whenever you change your mind.
      </p>
    </>
  )
}
