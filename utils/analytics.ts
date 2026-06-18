import { bumpSessionProgress } from '../services/quizSessionService'

type EventName =
  | 'gateway_selected'
  | 'card_started'
  | 'card_completed'
  | 'card_skipped'
  | 'quiz_completed'
  | 'results_viewed'
  | 'email_captured'

export function trackEvent(name: EventName, payload: Record<string, unknown> = {}): void {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[analytics] ${name}`, payload)
  }

  if (name === 'card_completed' && typeof payload.sessionId === 'string') {
    const { sessionId, cardsAnswered, completionPercentage } = payload as {
      sessionId: string
      cardsAnswered?: number
      completionPercentage?: number
    }
    if (typeof cardsAnswered === 'number' && typeof completionPercentage === 'number') {
      bumpSessionProgress(sessionId, cardsAnswered, completionPercentage).catch(() => {})
    }
  }
}
