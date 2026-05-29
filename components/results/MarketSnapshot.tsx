import { Location } from '../../types'
import { formatCurrency, formatPercent } from '../../utils/formatting'
import MarketBadge from '../shared/MarketBadge'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface MarketSnapshotProps {
  city: Location
}

export default function MarketSnapshot({ city }: MarketSnapshotProps) {
  const { market } = city
  const yoy = market.priceYOY

  const YOYIcon = yoy > 0.5 ? TrendingUp : yoy < -0.5 ? TrendingDown : Minus
  const yoyColor = yoy > 0.5 ? 'text-red-500' : yoy < -0.5 ? 'text-green-600' : 'text-gray-400'

  const contextMap = {
    'Sellers Market': 'Inventory is tight and homes are moving fast — expect competition.',
    'Balanced Market': 'Supply and demand are roughly equal, giving buyers and sellers similar leverage.',
    'Buyers Market': 'More inventory than buyers — you have room to negotiate.',
  }

  return (
    <div>
      <h3 className="font-bold text-gray-900 tracking-tight mb-4">Market snapshot</h3>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {(([
          { label: 'Median sale price', value: formatCurrency(market.redfinMedianPrice), subtext: 'Recent closed sales' },
          { label: 'Days on market', value: `${market.daysOnMarket} days` },
          { label: 'Sale to list ratio', value: `${market.saleToListRatio}%` },
        ]) as { label: string; value: string; subtext?: string }[]).map(item => (
          <div key={item.label} className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-1">{item.label}</p>
            <p className="font-bold text-gray-900 tabular-nums text-sm">{item.value}</p>
            {item.subtext && <p className="text-xs text-gray-400 mt-0.5">{item.subtext}</p>}
          </div>
        ))}
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs text-gray-400 mb-1">Price change (YOY)</p>
          <div className="flex items-center gap-1">
            <YOYIcon size={13} className={yoyColor} />
            <p className={`font-bold tabular-nums text-sm ${yoyColor}`}>{formatPercent(yoy)}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <MarketBadge condition={market.marketCondition} />
      </div>
      <p className="text-sm text-gray-500 leading-relaxed">{contextMap[market.marketCondition]}</p>
      <p className="text-xs text-gray-400 mt-3">{market.redfinDataSource}</p>
    </div>
  )
}
