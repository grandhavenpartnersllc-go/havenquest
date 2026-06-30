'use client'

import type { CSSProperties } from 'react'

const SHARED_STYLE: CSSProperties = {
  width: '100%',
  aspectRatio: '16/9',
  borderRadius: '12px',
  background: '#000',
  display: 'block',
  border: 'none',
}

export default function WelcomeVideo() {
  return (
    <video
      src="/videos/Navigator-Into-Video-COM.mp4"
      controls
      playsInline
      style={SHARED_STYLE}
    />
  )
}
