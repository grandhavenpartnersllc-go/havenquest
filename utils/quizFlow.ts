export type EntryPath = 'explorer' | 'directed' | 'instate' | 'exploring'
export type CardId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export interface FlowStep {
  id: CardId
  required: boolean
}

// Encodes Brief 1 Part 6 — per-path card visibility and requiredness.
// CP2 (THE FEEL merge): former steps 5 and 6 (growthProfile + lifestyleOrientation) now
// render as ONE step (Card5TheFeel, id 5). Id 6 is retired from every flow, so the flow
// length — and therefore the progress label and dots (both derive from getTotalCards) —
// drop by one automatically. Ids 7–10 are unchanged.
export const CARD_FLOW: Record<EntryPath, FlowStep[]> = {
  explorer: [1, 2, 3, 4, 5, 7, 8, 9, 10].map(id => ({ id: id as CardId, required: true })),
  directed: [1, 2, 3, 4, 5, 7, 8, 9].map(id => ({ id: id as CardId, required: true })),
  instate: [1, 2, 3, 4, 5, 7, 8, 9, 10].map(id => ({ id: id as CardId, required: true })),
  exploring: [
    ...[1, 2, 3, 4, 5].map(id => ({ id: id as CardId, required: true })),
    ...[7, 8, 9, 10].map(id => ({ id: id as CardId, required: false })),
  ],
}

// directed prepends a Metro Capture screen, which occupies progress slot 1.
export function getTotalCards(path: EntryPath): number {
  if (path === 'exploring') return 5
  if (path === 'directed') return CARD_FLOW.directed.length + 1
  return CARD_FLOW[path].length
}

export function getProgressLabel(path: EntryPath, screenPosition: number): { current: number; total: number } {
  const total = getTotalCards(path)
  return { current: Math.min(screenPosition, total), total }
}
