import { type SliderProps, Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

interface SliderWithLabelProps extends SliderProps {
  label: string
}

export function SliderWithLabel({ label, ...props }: SliderWithLabelProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Label htmlFor={props.id}>{label}</Label>
        <span>{props.value}%</span>
      </div>
      <Slider {...props} />
    </div>
  )
}

