import type * as React from "react"

interface DialProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  min?: number
  max?: number
  label: string
}

export function Dial({ value, min = 0, max = 100, label, ...props }: DialProps) {
  const percentage = ((value - min) / (max - min)) * 100
  const rotation = (percentage / 100) * 270 - 135 // -135 to 135 degrees

  return (
    <div className="flex flex-col items-center" {...props}>
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full border-4 border-gray-200"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-1 h-10 bg-blue-600 origin-bottom transform transition-transform duration-300 ease-in-out"
            style={{ transform: `rotate(${rotation}deg)` }}
          ></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold">{value}</span>
        </div>
      </div>
      <span className="mt-2 text-sm font-medium">{label}</span>
    </div>
  )
}

