import { AlertTriangle } from 'lucide-react'

interface AffordabilityWarningProps {
  cityName: string
  percent: number
}

export default function AffordabilityWarning({ cityName, percent }: AffordabilityWarningProps) {
  return (
    <div className="flex gap-3 bg-warning-bg border border-orange-200 rounded-lg p-4">
      <AlertTriangle size={18} className="text-warning-text shrink-0 mt-0.5" />
      <p className="text-sm text-warning-text leading-relaxed">
        Housing costs in {cityName} represent{' '}
        <strong>{percent}% of your monthly income</strong> — above the recommended 40% guideline.
        Consider a different housing preference or explore nearby suburbs.
      </p>
    </div>
  )
}
