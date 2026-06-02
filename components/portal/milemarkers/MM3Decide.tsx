import { Lock } from 'lucide-react'

const WARM_DARK = '#16120D'
const CARD_BG = '#FDFCFA'
const CARD_SHADOW = '0 1px 3px rgba(0,0,0,0.05), 0 4px 20px rgba(0,0,0,0.07)'

export default function MM3Decide() {
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
            Coming Next
          </p>
          <h2
            className="font-bold text-base tracking-tight mb-3"
            style={{ color: WARM_DARK }}
          >
            Decide
          </h2>
          <p className="text-sm leading-relaxed max-w-xl text-justify" style={{ color: '#6B6259' }}>
            Once you&apos;ve explored your results and are ready to commit your direction, this is where it happens. You&apos;ll fine-tune your priorities and financial picture in our live sandbox, then lock in your plan. The moment you commit, your Ambassador will be assigned and your journey shifts from discovery to action.
          </p>
        </div>
      </div>
    </div>
  )
}
