'use client'

import { ChevronDown, ChevronUp, Check, Lock } from 'lucide-react'

const GOLD = '#B8912A'
const GREEN = '#2D7D4E'

const MILEMARKERS = [
  { number: 1, name: 'Welcome' },
  { number: 2, name: 'Discover' },
  { number: 3, name: 'Refine' },
  { number: 4, name: 'Connect' },
  { number: 5, name: 'Plan' },
  { number: 6, name: 'Prepare' },
  { number: 7, name: 'Match' },
  { number: 8, name: 'Engage' },
  { number: 9, name: 'Transition' },
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
      {/* Desktop: pill tabs */}
      <div className="hidden md:block">
        <div
          className="flex overflow-x-auto gap-0.5 pb-3 border-b"
          style={{
            scrollbarWidth: 'none',
            borderBottomColor: 'rgba(0,0,0,0.08)',
          } as React.CSSProperties}
        >
          {MILEMARKERS.map(mm => {
            const status = getStatus(mm.number, currentMileMarker)
            const isSelected = activeMileMarker === mm.number

            const pillBg =
              status === 'complete' ? '#E8F5EE' :
              isSelected ? '#FBF3E3' :
              'transparent'

            const textColor =
              status === 'complete' ? GREEN :
              isSelected ? GOLD :
              'rgba(0,0,0,0.25)'

            return (
              <button
                key={mm.number}
                onClick={() => onSelect(mm.number)}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0"
                style={{
                  backgroundColor: pillBg,
                  color: textColor,
                  border: isSelected ? `1.5px solid ${GOLD}` : '1.5px solid transparent',
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

      {/* Mobile: accordion */}
      <div
        className="md:hidden border rounded-xl overflow-hidden mb-2"
        style={{ borderColor: 'rgba(0,0,0,0.08)' }}
      >
        {MILEMARKERS.map((mm, i) => {
          const status = getStatus(mm.number, currentMileMarker)
          const isSelected = activeMileMarker === mm.number

          const textColor =
            status === 'complete' ? GREEN :
            isSelected ? GOLD :
            'rgba(0,0,0,0.3)'

          const rowBg = isSelected ? '#FBF3E3' : 'transparent'

          return (
            <button
              key={mm.number}
              onClick={() => onSelect(mm.number)}
              className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors"
              style={{
                backgroundColor: rowBg,
                borderTop: i > 0 ? '1px solid rgba(0,0,0,0.06)' : 'none',
              }}
            >
              <div className="flex items-center gap-2.5">
                {status === 'complete' && <Check size={13} style={{ color: GREEN }} />}
                {status === 'locked' && <Lock size={12} style={{ color: 'rgba(0,0,0,0.25)' }} />}
                {status === 'active' && (
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: GOLD }}
                  />
                )}
                <span className="text-xs font-semibold" style={{ color: textColor }}>
                  {mm.number}. {mm.name}
                </span>
              </div>
              {isSelected
                ? <ChevronUp size={14} style={{ color: 'rgba(0,0,0,0.3)' }} />
                : <ChevronDown size={14} style={{ color: 'rgba(0,0,0,0.2)' }} />
              }
            </button>
          )
        })}
      </div>
    </>
  )
}
