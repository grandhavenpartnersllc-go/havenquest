// TODO: Create a Supabase scheduled function to delete rows from quiz_sessions
// where completed = false AND created_at < NOW() - INTERVAL '7 days'
// This cleanup job prevents orphaned session rows from accumulating over time.
// Build trigger: when Supabase dashboard access is configured for Craig.

// Navigator Quiz v2.1 (Brief 1) — single quiz_sessions row per session_id,
// created right after the name/ZIP step and updated by every card thereafter.

import { createClient } from '../lib/supabase/client'
import { QuizSessionData } from '../types'

const SESSION_KEY = 'hq_session_id'

export async function initSession(opts?: { firstName?: string; originZip?: string; email?: string }): Promise<string> {
  const existing = localStorage.getItem(SESSION_KEY)
  if (existing) return existing

  const sessionId = crypto.randomUUID()
  localStorage.setItem(SESSION_KEY, sessionId)

  const supabase = createClient()
  try {
    await supabase.from('quiz_sessions').insert({
      session_id: sessionId,
      current_step: 1,
      quiz_version: '2.1',
      ...(opts?.firstName && { first_name: opts.firstName }),
      ...(opts?.originZip && { origin_zip: opts.originZip }),
      ...(opts?.email && { email: opts.email }),
    })
  } catch (err) {
    console.warn('[quizSessionService] initSession write failed:', err)
  }

  return sessionId
}

export async function updateSessionStep(
  sessionId: string,
  step: number,
  data: Partial<QuizSessionData>
): Promise<void> {
  if (!sessionId) return
  const supabase = createClient()
  try {
    await supabase.from('quiz_sessions').upsert(
      {
        session_id: sessionId,
        current_step: step,
        ...(data.annualIncome !== undefined && { annual_income: data.annualIncome }),
        ...(data.householdSize !== undefined && { household_size: data.householdSize }),
        ...(data.movingTimeline !== undefined && { moving_timeline: data.movingTimeline }),
        ...(data.mustHaves !== undefined && { must_haves: data.mustHaves }),
        ...(data.niceToHaves !== undefined && { nice_to_haves: data.niceToHaves }),
        ...(data.notPriorities !== undefined && { not_priorities: data.notPriorities }),
        ...(data.buyerProfile !== undefined && { buyer_profile: data.buyerProfile }),
        ...(data.entryPath !== undefined && { entry_path: data.entryPath }),
        ...(data.archetype !== undefined && { archetype: data.archetype }),
        ...(data.priorities !== undefined && { priorities: data.priorities }),
        ...(data.communityFeel !== undefined && { community_feel: data.communityFeel }),
        ...(data.growthProfile !== undefined && { growth_profile: data.growthProfile }),
        ...(data.lifestyleOrientation !== undefined && { lifestyle_orientation: data.lifestyleOrientation }),
        ...(data.environment !== undefined && { environment: data.environment }),
        ...(data.pace !== undefined && { pace: data.pace }),
        ...(data.culture !== undefined && { culture: data.culture }),
        ...(data.homeStatus !== undefined && { home_status: data.homeStatus }),
        ...(data.movingTimeline !== undefined && { move_timeline: data.movingTimeline }),
        ...(data.workSituation !== undefined && { work_situation: data.workSituation }),
        ...(data.financialData !== undefined && { financial_data: data.financialData }),
        ...(data.metroPreference !== undefined && { metro_preference: data.metroPreference }),
        ...(data.targetMetro !== undefined && { target_metro: data.targetMetro }),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'session_id' }
    )
  } catch (err) {
    console.warn('[quizSessionService] updateSessionStep write failed:', err)
  }
}

export async function bumpSessionProgress(
  sessionId: string,
  cardsAnswered: number,
  completionPercentage: number
): Promise<void> {
  if (!sessionId) return
  const supabase = createClient()
  try {
    await supabase
      .from('quiz_sessions')
      .update({
        cards_answered: cardsAnswered,
        completion_percentage: completionPercentage,
        updated_at: new Date().toISOString(),
      })
      .eq('session_id', sessionId)
  } catch (err) {
    console.warn('[quizSessionService] bumpSessionProgress write failed:', err)
  }
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
