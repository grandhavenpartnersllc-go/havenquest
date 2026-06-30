'use client'

import type { CSSProperties } from 'react'

// ── CONFIGURE THIS ONE LINE TO CHANGE VIDEO SOURCE ──────────────
const WELCOME_VIDEO_SOURCE = "https://youtu.be/JmOtFx7hgiw"
// Accepted formats:
//   "/videos/navigator-welcome.mp4"          → HTML5 upload
//   "https://www.youtube.com/watch?v=XXXXX"  → YouTube embed
//   "https://youtu.be/XXXXX"                 → YouTube short URL
//   "https://vimeo.com/XXXXX"                → Vimeo embed
// ────────────────────────────────────────────────────────────────

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/)
  return match ? match[1] : null
}

function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/)
  return match ? match[1] : null
}

const SHARED_STYLE: CSSProperties = {
  width: '100%',
  aspectRatio: '16/9',
  borderRadius: '12px',
  background: '#000',
  display: 'block',
  border: 'none',
}

export default function WelcomeVideo() {
  const src = WELCOME_VIDEO_SOURCE

  const ytId = getYouTubeId(src)
  if (ytId) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`}
        style={SHARED_STYLE}
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Welcome to NAVIGATOR"
      />
    )
  }

  const vimeoId = getVimeoId(src)
  if (vimeoId) {
    return (
      <iframe
        src={`https://player.vimeo.com/video/${vimeoId}?title=0&byline=0&portrait=0`}
        style={SHARED_STYLE}
        allow="fullscreen; picture-in-picture"
        allowFullScreen
        title="Welcome to NAVIGATOR"
      />
    )
  }

  return (
    <video controls style={SHARED_STYLE}>
      <source src={src} type="video/mp4" />
    </video>
  )
}
