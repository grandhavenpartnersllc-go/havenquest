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
          <p className="text-sm leading-relaxed w-full text-justify" style={{ color: '#6B6259' }}>
            This is where you get behind the wheel and begin the journey with your destination in mind. Jump into our live sandbox — adjust your priorities, run the numbers, watch your city matches respond in real time. When something clicks and the direction feels right, you hit one button. Your plan becomes your foundation — not a contract, not a cage. Because the moment you&apos;re ready to move forward, your Market Director jumps in as your copilot and navigator. They ride shotgun with you through everything that comes next — and as you talk, new roads may open up that you hadn&apos;t even considered. The wheel stays in your hands. We just help you find the best route. Every great move starts somewhere. This is yours. And one day, it&apos;ll be the first chapter of your Journey Recap.
          </p>
        </div>
      </div>
    </div>
  )
}
