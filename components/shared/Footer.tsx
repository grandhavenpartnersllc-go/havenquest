import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ background: '#0A1E3D', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="max-w-6xl mx-auto px-4 pt-12 pb-8">

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <p className="font-bold text-[17px] tracking-tight mb-3" style={{ color: '#fff' }}>
              Haven<span style={{ color: '#C5B783' }}>Quest</span>
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Clarity. Confidence. Peace of mind.<br />Your Lone Star Lifestyle™ awaits.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>Product</p>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/#how-it-works" className="hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.5)' }}>How It Works</Link></li>
              <li><Link href="/begin" className="hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.5)' }}>Find My Texas →</Link></li>
              <li><Link href="/portal" className="hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.5)' }}>Your Portal</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>Company</p>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.5)' }}>About</Link></li>
              <li><Link href="/methodology" className="hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.5)' }}>Methodology</Link></li>
              <li><Link href="/for-realtors" className="hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.5)' }}>For Realtors</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>© 2026 HavenQuest</p>
          <div className="flex items-center gap-6" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
            <Link href="/privacy-policy" className="hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.5)' }}>Privacy</Link>
            <Link href="/methodology" className="hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.5)' }}>Terms</Link>
            <Link href="/texas/texas-insider" className="hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.5)' }}>Texas Insider</Link>
            <Link href="/for-realtors" className="hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.5)' }}>For Realtors</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
