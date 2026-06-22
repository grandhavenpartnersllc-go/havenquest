// Top marginal (or flat, where applicable) state individual income tax rate,
// as of 2026. Keyed by 2-letter USPS abbreviation — matches the format
// `hq_origin_state` is actually stored in (Zippopotam.us's "state abbreviation"
// field, see utils/zipLookup.ts), not full state names.
//
// This is a simplification for progressive-bracket states: actual liability
// depends on income level and filing status, not just the top bracket rate.
// States with no individual income tax (e.g. TX, FL, WA) are 0, not missing.
export const STATE_INCOME_TAX_RATE: Record<string, number> = {
  AL: 0.05,
  AK: 0,
  AZ: 0.025,
  AR: 0.039,
  CA: 0.133,
  CO: 0.044,
  CT: 0.0699,
  DE: 0.066,
  FL: 0,
  GA: 0.0539,
  HI: 0.11,
  ID: 0.058,
  IL: 0.0495,
  IN: 0.03,
  IA: 0.038,
  KS: 0.0558,
  KY: 0.04,
  LA: 0.03,
  ME: 0.0715,
  MD: 0.0575,
  MA: 0.09,
  MI: 0.0425,
  MN: 0.0985,
  MS: 0.044,
  MO: 0.047,
  MT: 0.0590,
  NE: 0.0484,
  NV: 0,
  NH: 0,
  NJ: 0.1075,
  NM: 0.059,
  NY: 0.109,
  NC: 0.0425,
  ND: 0.025,
  OH: 0.035,
  OK: 0.0475,
  OR: 0.099,
  PA: 0.0307,
  RI: 0.0599,
  SC: 0.062,
  SD: 0,
  TN: 0,
  TX: 0,
  UT: 0.0455,
  VT: 0.0875,
  VA: 0.0575,
  WA: 0,
  WV: 0.0482,
  WI: 0.0765,
  WY: 0,
  DC: 0.1075,
}

export function getStateIncomeTaxRate(stateAbbr: string | null | undefined): number | null {
  if (!stateAbbr) return null
  const rate = STATE_INCOME_TAX_RATE[stateAbbr.toUpperCase()]
  return rate === undefined ? null : rate
}
