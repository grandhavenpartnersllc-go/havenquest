'use client'

import { useEffect, useState } from 'react'
import { getMatchScoreColor } from '../../utils/scoring'

interface ScoreGaugeProps {
  score: number
  size?: number
}

export default function ScoreGauge({ score, size = 120 }: ScoreGaugeProps) {
  const [animated, setAnimated] = useState(0)
  const radius = (size - 16) / 2
  const circumference = 2 * Math.PI * radius
  const strokeWidth = 8
  const center = size / 2
  const dashOffset = circumference - (animated / 100) * circumference
  const color = getMatchScoreColor(score)

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(score), 100)
    return () => clearTimeout(timer)
  }, [score])

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-medium tabular-nums" style={{ color }}>{score}</span>
        <span className="text-xs text-gray-500">match</span>
      </div>
    </div>
  )
}
