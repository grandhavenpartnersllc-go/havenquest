// Homepage reface — canonical palette (locked design).
// Mirrors the --color-hq-* tokens in app/globals.css @theme; kept as JS consts so the
// home components can use them in inline styles (matching the repo's existing homepage
// idiom). Single source for the home shell — do not scatter raw hexes in the components.

export const HQ = {
  // Navy
  navy: '#081426', // deepest — page/base bg
  navy2: '#0A1B33',
  navy3: '#0F2340',
  navy4: '#12233B',
  navy5: '#13315A',

  // Gold
  gold: '#C9A961', // primary
  goldHover: '#DCC088',
  goldGlow: '#E8C877',
  goldBright: '#F1D488',
  goldMuted: '#B08D57',
  goldDeep: '#8A7454',

  // Text
  offwhite: '#F6F4EF',
  white: '#FFFFFF',
  slate: '#93A4BC',
  slate2: '#5B6B80',
  slate3: '#A9B6C8',

  // Cream (Communities light section)
  cream: '#FBF3DF',
  cream2: '#F4F1EA',
  cream3: '#EFEADF',
} as const

// Font stacks (next/font exposes the CSS vars app-wide via app/layout.tsx)
export const SERIF = "var(--font-playfair), Georgia, 'Times New Roman', serif"
export const SANS = 'var(--font-poppins), system-ui, -apple-system, sans-serif'

// Every "Find My Texas" CTA points here.
export const FIND_MY_TEXAS_HREF = '/begin'
