// Homepage palette — SiteLight-B1 (lighter homepage, one navy and one gold).
// Kept as JS consts so the home components can use them in inline styles (matching the
// repo's existing homepage idiom). Single source for the home shell — do not scatter raw
// hexes in the components.
//
// B1 unified the two brand navies and the two golds that previously shipped side by side:
//   navy  #081426 -> #0A1E3D  (the value already used by the 13 shared-Header routes,
//                              the investor page and the Navigator)
//   gold  #C9A961 -> #C5B783  for TEXT, LINES and the WORDMARK
// #C9A961 survives as `goldBtn` ONLY — gold pill buttons keep the warmer, more saturated
// tone so they read as a control rather than as decoration. Two distinct exports, never
// one `gold`, so a future edit cannot silently merge them again.
//
// Consumers outside components/home (confirmed at B1-CP0): shared/FunnelHeader (Discovery's
// top bar — an intended side effect) and shared/FunnelFooter (imports HQ but is rendered
// nowhere, so the change has no visual effect; left in place deliberately).

export const HQ = {
  // Navy — one navy, repo-wide
  navy: '#0A1E3D', // page/base bg, headings, icons
  navy2: '#0A1B33', // retained: footer CTA-card gradient
  navy3: '#0F2340', // retained: footer CTA-card gradient
  navy4: '#12233B', // retained: city-card photo fallback
  navy5: '#13315A', // retained: HowItWorks photo fallback

  // Gold — text/lines/wordmark
  gold: '#C5B783',
  goldGlow: '#E8C877', // TexasMap city-light glow
  goldBright: '#F1D488', // TexasMap selected city-light
  goldMuted: '#B08D57',
  goldDeep: '#8A7454',
  goldLabel: '#7A6A3E', // section labels ("The Challenge", "How It Works")
  goldWordmark: '#A8935A', // "Quest" inside the Challenge clarity card

  // Gold — BUTTONS ONLY (deliberately not `gold`)
  goldBtn: '#C9A961',
  goldBtnHover: '#D6B979',

  // Surfaces
  stone: '#F2F1EE', // canvas — shared with Discovery Intake and the Navigator
  card: '#FFFFFF',
  cardBorder: '#DCDAD2',
  chipBg: '#F4F2EE', // Challenge chips
  chipText: '#6A6F78',
  chaosBg: '#E9E6DF', // Challenge card, left half
  heroFade: '248,247,244', // rgb triplet for the hero's light fade

  // Text
  ink: '#1C2430', // body
  muted: '#5E6573', // secondary
  offwhite: '#F6F4EF',
  white: '#FFFFFF',
  slate: '#93A4BC',
  slate2: '#5B6B80',
  slate3: '#A9B6C8',

  // Cream — retained for reference; no longer used on the homepage (Communities is stone now)
  cream: '#FBF3DF',
  cream2: '#F4F1EA',
  cream3: '#EFEADF',
} as const

// Font stack. B1: Poppins only on the homepage — Playfair (SERIF) was removed from all five
// homepage sections. SERIF intentionally no longer exported from here.
export const SANS = 'var(--font-poppins), system-ui, -apple-system, sans-serif'

// Every "Find My Texas" CTA points here.
export const FIND_MY_TEXAS_HREF = '/begin'
