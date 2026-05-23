export function getScoreColor(score: number): string {
  if (score >= 8) return '#3B6D11'
  if (score >= 6) return '#1A5FA8'
  if (score >= 4) return '#6B7280'
  return '#A32D2D'
}

export function getScoreBg(score: number): string {
  if (score >= 8) return '#EAF3DE'
  if (score >= 6) return '#EBF3FB'
  if (score >= 4) return '#F7F6F3'
  return '#FCEBEB'
}

export function getScoreLabel(score: number): string {
  if (score >= 9) return 'Excellent'
  if (score >= 7) return 'Good'
  if (score >= 5) return 'Average'
  if (score >= 3) return 'Below Avg'
  return 'Poor'
}

export function getMatchScoreColor(score: number): string {
  if (score >= 80) return '#3B6D11'
  if (score >= 65) return '#1A5FA8'
  if (score >= 50) return '#6B7280'
  return '#A32D2D'
}
