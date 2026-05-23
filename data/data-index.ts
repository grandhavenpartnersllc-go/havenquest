// data/index.ts
// All data exports and query functions
// Phase 1: static JSON
// Phase 2: swap implementations in locationService.ts without touching this file

export { default as texasCities } from './cities'
export { default as texasRealtors, getRealtorsByCity, getTopRealtors } from './realtors'

// Metro groupings for Metro Mode
export const texasMetros = {
  austin: {
    name: 'Austin Metro',
    cityIds: [
      'austin-tx',
      'round-rock-tx',
      'cedar-park-tx',
      'georgetown-tx',
      'kyle-tx',
      'san-marcos-tx',
      'leander-tx',
      'pflugerville-tx',
    ],
  },
  dallas: {
    name: 'Dallas-Fort Worth Metro',
    cityIds: [
      'dallas-tx',
      'fort-worth-tx',
      'frisco-tx',
      'plano-tx',
      'mckinney-tx',
    ],
  },
  houston: {
    name: 'Houston Metro',
    cityIds: [
      'houston-tx',
      'the-woodlands-tx',
      'sugar-land-tx',
    ],
  },
  sanAntonio: {
    name: 'San Antonio Metro',
    cityIds: [
      'san-antonio-tx',
      'new-braunfels-tx',
    ],
  },
}
