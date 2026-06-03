import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#08101C] text-white/40 mt-auto border-t border-white/8">
      <div className="max-w-6xl mx-auto px-4 pt-12 pb-8">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <p className="text-white font-bold text-[17px] tracking-tight mb-3">
              Haven<span className="text-blue-400">Quest</span>
            </p>
            <p className="text-sm leading-relaxed text-white/40">
              Relocation intelligence with a human touch.
            </p>
          </div>

          <div>
            <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-4">Product</p>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/explore" className="hover:text-white/80 transition-colors">Explore Texas</Link></li>
              <li><Link href="/begin" className="hover:text-white/80 transition-colors">Begin My Journey</Link></li>
              <li><Link href="/portal" className="hover:text-white/80 transition-colors">Your Portal</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-4">Cities</p>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/texas/austin-tx" className="hover:text-white/80 transition-colors">Austin</Link></li>
              <li><Link href="/texas/dallas-tx" className="hover:text-white/80 transition-colors">Dallas</Link></li>
              <li><Link href="/texas/houston-tx" className="hover:text-white/80 transition-colors">Houston</Link></li>
              <li><Link href="/texas/san-antonio-tx" className="hover:text-white/80 transition-colors">San Antonio</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-4">Company</p>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/about" className="hover:text-white/80 transition-colors">About</Link></li>
              <li><Link href="/data-disclosure" className="hover:text-white/80 transition-colors">Data Disclosure</Link></li>
              <li><Link href="/methodology" className="hover:text-white/80 transition-colors">Methodology</Link></li>
              <li><Link href="/for-realtors" className="hover:text-white/80 transition-colors">For Realtors</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/8 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-white/25">
          <p>© {new Date().getFullYear()} HavenQuest. All rights reserved.</p>
          <p className="text-center">
            Scores are directional lifestyle guidance — not financial, legal, or real estate advice.{' '}
            <Link href="/methodology" className="text-blue-400/70 hover:text-blue-400 transition-colors">How scores work</Link>
          </p>
        </div>

      </div>
    </footer>
  )
}
