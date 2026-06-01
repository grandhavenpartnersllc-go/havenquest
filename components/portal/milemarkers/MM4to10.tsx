import { Lock } from 'lucide-react'

const WARM_DARK = '#16120D'
const CARD_BG = '#FDFCFA'
const CARD_SHADOW = '0 1px 3px rgba(0,0,0,0.05), 0 4px 20px rgba(0,0,0,0.07)'

const PREVIEW_COPY: Record<number, string> = {
  4: "Your Ambassador has already reviewed your full profile before reaching out. No ‘tell me about yourself’ — just real guidance from someone who knows your market and your situation. Expect to hear from them within 24 hours of being assigned.",
  5: "You and your Ambassador will have a real strategy conversation about your timeline, financing, and target city. You’ll leave with a clear, confirmed direction — and your Ambassador will have everything they need to prepare your realtor shortlist.",
  6: "Before you meet your realtor, everything needs to be in place — financing, insurance, logistics, and decision readiness. Your Ambassador guides you through every item on the checklist. Nothing gets left to the last minute.",
  7: "Based on everything your Ambassador knows about you, they’ll hand-select three of the best realtors in your target market. Equal presentation — no rankings, no paid placement. You choose who you want to work with.",
  8: "Your Ambassador personally introduces you to your chosen realtor — not an automated email, a real human handoff. Your realtor already knows your story, your budget, and your priorities before you speak.",
  9: "When you find the right home and go under contract, the finish line comes into view. Your entire team — Ambassador and realtor — is with you every step of the way through inspection, appraisal, and closing.",
  10: "This is what it’s all been building toward. When you close on your new Texas home, HavenQuest celebrates with you — and your complete AI-generated Journey Recap will be waiting, telling the story of your entire relocation from first click to closing day.",
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
          <p className="text-sm leading-relaxed max-w-xl" style={{ color: '#6B6259' }}>
            {copy}
          </p>
        </div>
      </div>
    </div>
  )
}
