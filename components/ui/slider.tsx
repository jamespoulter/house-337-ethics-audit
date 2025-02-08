import type * as React from "react"

interface SliderProps extends React.HTMLAttributes<HTMLInputElement> {
  id: string
  min: number
  max: number
  step?: number
  value: number[]
  onValueChange: (value: number[]) => void
}

export function Slider({ id, min, max, step = 1, value, onValueChange, ...props }: SliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number.parseInt(e.target.value, 10)
    onValueChange([newValue])
  }

  return (
    <input
      type="range"
      id={id}
      min={min}
      max={max}
      step={step}
      value={value[0]}
      onChange={handleChange}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      {...props}
    />
  )
}

export type { SliderProps }

