interface MarketBadgeProps {
  condition: 'Sellers Market' | 'Balanced Market' | 'Buyers Market'
}

const styles = {
  'Sellers Market': 'bg-red-100 text-red-700',
  'Balanced Market': 'bg-blue-100 text-blue-700',
  'Buyers Market': 'bg-green-100 text-green-700',
}

export default function MarketBadge({ condition }: MarketBadgeProps) {
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${styles[condition]}`}>
      {condition}
    </span>
  )
}
