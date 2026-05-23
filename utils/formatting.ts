export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`
}

export function formatPercentPlain(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

export function formatIncomeInput(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (!digits) return ''
  return parseInt(digits, 10).toLocaleString('en-US')
}

export function parseIncomeInput(formatted: string): number {
  return parseInt(formatted.replace(/\D/g, ''), 10) || 0
}

export function incomeRangeLabel(income: number): string {
  if (income < 50000) return 'Under $50K'
  if (income < 75000) return '$50K–$75K'
  if (income < 100000) return '$75K–$100K'
  if (income < 150000) return '$100K–$150K'
  if (income < 200000) return '$150K–$200K'
  return '$200K+'
}
