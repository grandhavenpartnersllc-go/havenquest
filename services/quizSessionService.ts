// TODO: Create a Supabase scheduled function to delete rows from quiz_sessions
// where completed = false AND created_at < NOW() - INTERVAL '7 days'
// This cleanup job prevents orphaned session rows from accumulating over time.
// Build trigger: when Supabase dashboard access is configured for Craig.

// Step label map (6-step quiz as of 2026-05-30)
// 1 → household_income
// 2 → financial_picture  (inserted between household and timeline)
// 3 → lifestyle_priorities
// 4 → must_haves
// 5 → priority_ranking
// 6 → buyer_profile

import { createClient } from '../lib/supabase/client'
import { QuizSessionData } from '../types'

const SESSION_KEY = 'hq_session_id'

export async function initSession(): Promise<string> {
  const existing = localStorage.getItem(SESSION_KEY)
  if (existing) return existing

  const sessionId = crypto.randomUUID()
  localStorage.setItem(SESSION_KEY, sessionId)

  const supabase = createClient()
  await supabase.from('quiz_sessions').insert({
    session_id: sessionId,
    current_step: 1,
  })

  return sessionId
}

export async function updateSessionStep(
  sessionId: string,
  step: number,
  data: Partial<QuizSessionData>
): Promise<void> {
  if (!sessionId) return
  const supabase = createClient()
  await supabase.from('quiz_sessions').upsert(
    {
      session_id: sessionId,
      current_step: step,
      ...(data.annualIncome !== undefined && { annual_income: data.annualIncome }),
      ...(data.householdSize !== undefined && { household_size: data.householdSize }),
      ...(data.housingPreference !== undefined && { housing_preference: data.housingPreference }),
      ...(data.movingTimeline !== undefined && { moving_timeline: data.movingTimeline }),
      ...(data.mustHaves !== undefined && { must_haves: data.mustHaves }),
      ...(data.niceToHaves !== undefined && { nice_to_haves: data.niceToHaves }),
      ...(data.notPriorities !== undefined && { not_priorities: data.notPriorities }),
      ...(data.buyerProfile !== undefined && { buyer_profile: data.buyerProfile }),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'session_id' }
  )
}

export async function completeSession(sessionId: string, email: string): Promise<void> {
  if (!sessionId) return
  const supabase = createClient()
  await supabase.from('quiz_sessions')
    .update({ completed: true, email, updated_at: new Date().toISOString() })
    .eq('session_id', sessionId)
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY)
}
