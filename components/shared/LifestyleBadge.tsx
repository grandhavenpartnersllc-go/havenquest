import { LIFESTYLE_CATEGORIES } from '../../utils/constants'
import { LifestyleScores } from '../../types'

interface LifestyleBadgeProps {
  category: keyof LifestyleScores
  variant?: 'default' | 'accent'
}

export default function LifestyleBadge({ category, variant = 'default' }: LifestyleBadgeProps) {
  const cat = LIFESTYLE_CATEGORIES.find(c => c.key === category)
  if (!cat) return null

  const base = 'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium'
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    accent: 'bg-blue-50 text-accent border border-accent',
  }

  return (
    <span className={`${base} ${variants[variant]}`}>
      <span>{cat.icon}</span>
      <span>{cat.label}</span>
    </span>
  )
}
