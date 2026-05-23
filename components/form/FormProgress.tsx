interface FormProgressProps {
  step: number
  totalSteps: number
  stepLabels: string[]
}

export default function FormProgress({ step, totalSteps, stepLabels }: FormProgressProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs text-gray-400 font-medium">
          Step {step + 1} of {totalSteps}
        </span>
        <span className="text-xs font-bold text-gray-900 tracking-tight">{stepLabels[step]}</span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{ backgroundColor: i <= step ? '#1A5FA8' : '#E5E7EB' }}
          />
        ))}
      </div>
    </div>
  )
}
