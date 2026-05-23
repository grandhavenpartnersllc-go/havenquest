interface TEARatingBadgeProps {
  rating: 'A' | 'B' | 'C' | 'D' | 'F'
  size?: 'sm' | 'md' | 'lg'
}

const styles = {
  A: { bg: '#EAF3DE', text: '#3B6D11' },
  B: { bg: '#EBF3FB', text: '#1A5FA8' },
  C: { bg: '#FFF7ED', text: '#9A3412' },
  D: { bg: '#FEF3C7', text: '#92400E' },
  F: { bg: '#FCEBEB', text: '#A32D2D' },
}

const sizes = {
  sm: 'w-7 h-7 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-14 h-14 text-xl',
}

export default function TEARatingBadge({ rating, size = 'md' }: TEARatingBadgeProps) {
  const style = styles[rating]
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-semibold ${sizes[size]}`}
      style={{ background: style.bg, color: style.text }}
      title={`TEA Rating: ${rating}`}
    >
      {rating}
    </span>
  )
}
