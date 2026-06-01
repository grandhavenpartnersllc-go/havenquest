'use client'

import { ChevronDown, ChevronUp, Check, Lock } from 'lucide-react'

const WARM_DARK = '#16120D'
const GOLD = '#B8912A'
const GREEN = '#2D7D4E'

const MILEMARKERS = [
  { number: 1, name: 'Explore' },
  { number: 2, name: 'Discover' },
  { number: 3, name: 'Decide' },
  { number: 4, name: 'Connect' },
  { number: 5, name: 'Plan' },
  { number: 6, name: 'Prepare' },
  { number: 7, name: 'Match' },
  { number: 8, name: 'Engage' },
  { number: 9, name: 'Contract' },
  { number: 10, name: 'Home' },
] as const

function getStatus(mmNumber: number, currentMileMarker: number): 'complete' | 'active' | 'locked' {
  if (mmNumber < currentMileMarker) return 'complete'
  if (mmNumber === currentMileMarker) return 'active'
  return 'locked'
}

interface NavigatorTabsProps {
  currentMileMarker: number
  activeMileMarker: number
  onSelect: (mm: number) => void
}

export default function NavigatorTabs({ currentMileMarker, activeMileMarker, onSelect }: NavigatorTabsProps) {
  return (
    <>
      {/* Desktop: horizontal tabs */}
      <div className="hidden md:block" style={{ backgroundColor: WARM_DARK }}>
        <div className="max-w-5xl mx-auto px-5">
          <div
            className="flex overflow-x-auto"
            style={{ scrollbarWidth: 'none' } as React.CSSProperties}
          >
            {MILEMARKERS.map(mm => {
              const status = getStatus(mm.number, currentMileMarker)
              const isSelected = activeMileMarker === mm.number
              return (
                <button
                  key={mm.number}
                  onClick={() => onSelect(mm.number)}
                  className="flex items-center gap-1.5 px-4 py-3.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors shrink-0"
                  style={{
                    borderBottomColor: isSelected ? GOLD : 'transparent',
                    color:
                      status === 'complete'
                        ? GREEN
                        : isSelected
                        ? GOLD
                        : status === 'locked'
                        ? 'rgba(232,226,217,0.3)'
                        : 'rgba(232,226,217,0.7)',
                  }}
                >
                  {status === 'complete' && <Check size={11} />}
                  {status === 'locked' && <Lock size={10} />}
                  {status === 'active' && (
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: GOLD }}
                    />
                  )}
                  <span>{mm.number}. {mm.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Mobile: accordion */}
      <div className="md:hidden" style={{ backgroundColor: WARM_DARK }}>
        <div className="max-w-5xl mx-auto px-5">
          {MILEMARKERS.map((mm, i) => {
            const status = getStatus(mm.number, currentMileMarker)
            const isSelected = activeMileMarker === mm.number
            return (
              <button
                key={mm.number}
                onClick={() => onSelect(mm.number)}
                className="w-full flex items-center justify-between py-3 text-left"
                style={{
                  borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}
              >
                <div className="flex items-center gap-2.5">
                  {status === 'complete' && <Check size={13} style={{ color: GREEN }} />}
                  {status === 'locked' && <Lock size={12} style={{ color: 'rgba(232,226,217,0.3)' }} />}
                  {status === 'active' && (
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: GOLD }}
                    />
                  )}
                  <span
                    className="text-xs font-semibold"
                    style={{
                      color:
                        status === 'complete'
                          ? GREEN
                          : isSelected
                          ? GOLD
                          : status === 'locked'
                          ? 'rgba(232,226,217,0.3)'
                          : 'rgba(232,226,217,0.7)',
                    }}
                  >
                    {mm.number}. {mm.name}
                  </span>
                </div>
                {isSelected ? (
                  <ChevronUp size={14} style={{ color: 'rgba(232,226,217,0.4)' }} />
                ) : (
                  <ChevronDown size={14} style={{ color: 'rgba(232,226,217,0.3)' }} />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
