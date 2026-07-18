'use client'

import { useState } from 'react'
import Slider from '../Slider'
import CardShell, { PILL_CLASS } from '../CardShell'
import { NAVY } from '../quizTheme'

// THE FEEL — merged step (CP2). The two former single-slider pages (Card5GrowthProfile,
// Card6LifestyleOrientation) now live on one page under the shared "The Feel" eyebrow and
// one headline. Each original question survives VERBATIM as its own slider's sub-label, in
// the original order (community first, lifestyle second), separated by a hairline rule.
// Slider mechanics, defaults (5), end-labels and persistence are unchanged — the two sliders
// were only moved onto one page, not rebuilt.

interface Card5TheFeelProps {
  initialGrowth?: number
  initialLifestyle?: number
  onComplete: (growthProfile: number, lifestyleOrientation: number) => void
  onBack?: () => void
}

const SUBLABEL_STYLE: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 600,
  color: NAVY,
  textAlign: 'center',
  lineHeight: 1.35,
  margin: '0 0 14px',
}

export default function Card5TheFeel({ initialGrowth, initialLifestyle, onComplete, onBack }: Card5TheFeelProps) {
  const [growth, setGrowth] = useState(initialGrowth ?? 5)
  const [lifestyle, setLifestyle] = useState(initialLifestyle ?? 5)

  return (
    <CardShell
      eyebrow="The Feel"
      title="What should your community feel like?"
      onBack={onBack}
      next={
        <button type="button" onClick={() => onComplete(growth, lifestyle)} className={PILL_CLASS}>
          Continue
        </button>
      }
    >
      {/* Question 1 — community (former Card 5), VERBATIM */}
      <div style={{ maxWidth: '28rem', margin: '0 auto', padding: '4px 0' }}>
        <p style={SUBLABEL_STYLE}>When it comes to your community, where do you land?</p>
        <Slider leftLabel="Established & Proven" rightLabel="Up-and-Coming & Growing" value={growth} onChange={setGrowth} />
      </div>

      {/* Hairline rule + Question 2 — lifestyle (former Card 6), VERBATIM */}
      <div className="hq-qblock" style={{ maxWidth: '28rem', margin: '22px auto 0' }}>
        <p style={SUBLABEL_STYLE}>How would you describe your ideal lifestyle?</p>
        <Slider leftLabel="Practical & Comfortable" rightLabel="Upscale & Aspirational" value={lifestyle} onChange={setLifestyle} />
      </div>
    </CardShell>
  )
}
