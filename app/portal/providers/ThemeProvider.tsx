'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { createClient } from '../../../lib/supabase/client'

export type Theme = 'light' | 'dark' | 'system'

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => Promise<void>
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

function isValidTheme(v: unknown): v is Theme {
  return v === 'light' || v === 'dark' || v === 'system'
}

function resolveAndApply(theme: Theme): void {
  const root = document.documentElement
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    root.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
  } else {
    root.setAttribute('data-theme', theme)
  }
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system')

  useEffect(() => {
    ;(async () => {
      try {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user?.email) return
        const { data } = await supabase
          .from('users')
          .select('theme_preference')
          .eq('email', session.user.email.toLowerCase())
          .single()
        const raw = (data as Record<string, unknown> | null)?.theme_preference
        const pref: Theme = isValidTheme(raw) ? raw : 'system'
        setThemeState(pref)
        resolveAndApply(pref)
      } catch (err) {
        console.error('[ThemeProvider] failed to load preference:', err)
      }
    })()
  }, [])

  useEffect(() => {
    resolveAndApply(theme)
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => resolveAndApply('system')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  async function setTheme(newTheme: Theme): Promise<void> {
    setThemeState(newTheme)
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user?.email) return
      await supabase
        .from('users')
        .update({ theme_preference: newTheme })
        .eq('email', session.user.email.toLowerCase())
    } catch (err) {
      console.error('[ThemeProvider] failed to persist theme:', err)
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
