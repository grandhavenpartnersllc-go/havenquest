export async function logZillowClick(userId: string | null, city: string): Promise<void> {
  try {
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, city, eventType: 'zillow_click' }),
    })
  } catch {
    // Non-blocking — don't let logging failures affect UX
  }
}

export async function logRealtorContact(
  userId: string | null,
  city: string,
  realtorId: string
): Promise<void> {
  try {
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, city, realtorId, eventType: 'realtor_contact' }),
    })
  } catch {
    // Non-blocking
  }
}
