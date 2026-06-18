'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { NAVY, GOLD } from './quizTheme'

interface PhotoOptionCardProps {
  imageUrl: string
  title: string
  selected: boolean
  onClick: () => void
}

export default function PhotoOptionCard({ imageUrl, title, selected, onClick }: PhotoOptionCardProps) {
  const [imgError, setImgError] = useState(false)

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 text-left transition-all hover:shadow-md"
      style={{ borderColor: selected ? NAVY : '#E5E7EB' }}
    >
      {imgError ? (
        <div className="absolute inset-0" style={{ backgroundColor: NAVY }} />
      ) : (
        <>
          {/* Plain <img>, not next/image — onError firing reliably for a
              missing local file matters more here than image optimization. */}
          <img
            src={imageUrl}
            alt={title}
            onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.65) 100%)' }}
          />
        </>
      )}

      <span className="absolute bottom-3 left-3 right-3 text-sm font-bold text-white leading-snug">
        {title}
      </span>

      {selected && (
        <>
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(10,30,61,0.3)' }} />
          <span
            className="absolute top-1/2 left-1/2 w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: GOLD, transform: 'translate(-50%, -50%)' }}
          >
            <Check size={20} color={NAVY} strokeWidth={3} />
          </span>
        </>
      )}
    </button>
  )
}
