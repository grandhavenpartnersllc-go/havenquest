import type { Metadata } from 'next'
import { Poppins, Playfair_Display } from 'next/font/google'
import './globals.css'
import BetaGate from '@/components/BetaGate'

// Brief 4 — app-wide font swap Inter → Poppins (matches the approved prototype). Poppins is
// not a variable font, so next/font requires explicit weights. 300 added for the homepage
// reface's lighter UI copy; 400–700 stay for the rest of the app. Exposed as --font-poppins,
// consumed by Tailwind v4's --font-sans in globals.css, so the whole app inherits it.
const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
})

// Homepage reface — Playfair Display for hero + editorial headlines. Previously loaded only
// on /texas/*; promoted app-wide here so the new public homepage can use it via --font-serif
// (Tailwind `font-serif`). Includes italics for the gold accent phrases in the design.
const playfair = Playfair_Display({
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})


export const metadata: Metadata = {
  title: 'HavenQuest — Find Where Your Life Fits in Texas',
  description: 'Match your income and lifestyle to the right Texas city or neighborhood, then connect with the best realtors in your market. Free relocation intelligence.',
  openGraph: {
    title: 'HavenQuest — Texas Relocation Intelligence',
    description: 'Find where your income, household, and lifestyle priorities actually fit in Texas.',
    url: 'https://havenquest.co',
    siteName: 'HavenQuest',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HavenQuest — Find Where Your Life Fits in Texas',
    description: 'Match your income and lifestyle to the right Texas city — free.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${playfair.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <BetaGate />
        {children}
      </body>
    </html>
  )
}
