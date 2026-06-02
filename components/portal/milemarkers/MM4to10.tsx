import { Lock } from 'lucide-react'

const WARM_DARK = '#16120D'
const CARD_BG = '#FDFCFA'
const CARD_SHADOW = '0 1px 3px rgba(0,0,0,0.05), 0 4px 20px rgba(0,0,0,0.07)'

const PREVIEW_COPY: Record<number, string> = {
  4: "You’ve done the hard work. Now someone who knows your market, has read your full report, and genuinely wants to help you get home is stepping into the picture. Your HavenQuest Market Director will reach out within 24 hours — and unlike most first conversations in real estate, this one won’t start with ‘so tell me about yourself.’ They already know. This is where the journey gets personal.",
  5: "Your Market Director sits down with you — really sits down — and maps out your path forward. Timeline, financing, target city, target zone, must-haves in a home. By the end of this conversation you’ll have a clear direction, a realistic plan, and someone who knows exactly what it’s going to take to get you there. This is where scattered ideas become a real strategy.",
  6: "This is where your move starts becoming real. Before you meet your Select Agent, your Market Director walks you through everything that needs to be in place — financing confirmed, insurance sorted, timeline locked. It sounds like a checklist. It feels like momentum. By the time you’re introduced to your agent, you’ll walk in knowing exactly what you can spend, when you want to close, and what your dream home actually looks like. No surprises. Just confidence.",
  7: "Based on everything your Market Director now knows about you — your market, your budget, your non-negotiables — they hand-select three of the best agents in your target area. Not a directory. Not an algorithm. Three real professionals, chosen specifically for you, presented equally. You read the profiles. You choose who you want. Simple as that.",
  8: "This is the introduction you’ve been building toward. Your Market Director makes a warm, personal handoff to your chosen Select Agent — someone who already knows your story, your budget, and exactly what you’re looking for before you ever speak. No re-explaining. No starting from scratch. Just a knowledgeable professional ready to find your home from day one.",
  9: "You found it. The right home, in the right place, at the right price. Going under contract is one of the most exciting — and yes, occasionally nerve-wracking — moments in the entire journey. Your Select Agent handles the strategy and negotiation. Your Market Director is still right there if you need them. The finish line is in sight and your whole team is with you.",
  10: "This is what all of it was for. The quiz, the sandbox, the strategy session, the showings, the offer, the counter, the inspection, the appraisal — all of it led here. You’re home. HavenQuest celebrates with you, and when you’re ready, your personal Journey Recap will be waiting — the full story of how you got here, from your very first click to the keys in your hand.",
}

interface MM4to10Props {
  mmNumber: number
  name: string
}

export default function MM4to10({ mmNumber, name }: MM4to10Props) {
  const copy = PREVIEW_COPY[mmNumber] ?? ''

  return (
    <div
      className="rounded-2xl p-8"
      style={{ backgroundColor: CARD_BG, boxShadow: CARD_SHADOW }}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: 'rgba(0,0,0,0.04)' }}
        >
          <Lock size={18} style={{ color: '#9A8E82' }} />
        </div>
        <div>
          <p
            className="text-[10px] font-bold uppercase mb-1"
            style={{ color: '#9A8E82', letterSpacing: '0.18em' }}
          >
            Locked
          </p>
          <h2
            className="font-bold text-base tracking-tight mb-3"
            style={{ color: WARM_DARK }}
          >
            {name}
          </h2>
          <p className="text-sm leading-relaxed w-full" style={{ color: '#6B6259' }}>
            {copy}
          </p>
        </div>
      </div>
    </div>
  )
}
