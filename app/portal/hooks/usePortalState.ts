'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../../lib/supabase/client'

export interface TeamMembers {
  marketDirector: string | null
  selectAgent: string | null
  lender: string | null
}

export interface PortalState {
  currentMM: number
  completedMMs: number[]
  firstName: string | null
  teamMembers: TeamMembers
  loading: boolean
  error: string | null
}

interface PortalStateRow {
  first_name: string | null
  current_milemarker: number | null
  market_director_name: string | null
  select_agent_name: string | null
  lender_name: string | null
}

const initialState: PortalState = {
  currentMM: 1,
  completedMMs: [],
  firstName: null,
  teamMembers: { marketDirector: null, selectAgent: null, lender: null },
  loading: true,
  error: null,
}

export function usePortalState(): PortalState {
  const [state, setState] = useState<PortalState>(initialState)

  useEffect(() => {
    const supabase = createClient()

    const load = async (): Promise<void> => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session?.user?.email) {
        setState({ ...initialState, loading: false, error: 'No active session' })
        return
      }

      const { data, error } = await supabase
        .from('users')
        .select('first_name, current_milemarker, market_director_name, select_agent_name, lender_name')
        .eq('email', session.user.email.toLowerCase())
        .single()

      if (error || !data) {
        setState({ ...initialState, loading: false, error: 'Failed to load portal state' })
        return
      }

      const row = data as PortalStateRow | null
      if (!row) {
        setState({ ...initialState, loading: false, error: 'No user record found' })
        return
      }

      const mm = row.current_milemarker ?? 1
      const completedMMs = Array.from({ length: Math.max(0, mm - 1) }, (_, i) => i + 1)

      setState({
        currentMM: mm,
        completedMMs,
        firstName: row.first_name,
        teamMembers: {
          marketDirector: row.market_director_name,
          selectAgent: row.select_agent_name,
          lender: row.lender_name,
        },
        loading: false,
        error: null,
      })
    }

    void load()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        void load()
      } else if (event === 'SIGNED_OUT') {
        setState(initialState)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return state
}
