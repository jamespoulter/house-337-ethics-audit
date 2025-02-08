import { type SliderProps, Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

interface SliderWithRulesProps extends SliderProps {
  label: string
  rules: string[]
  questions: { question: string; answer: number }[]
}

export function SliderWithRules({ label, rules, questions, ...props }: SliderWithRulesProps) {
  // Calculate the average score from questions
  const averageScore =
    questions.length > 0 ? Math.round(questions.reduce((sum, q) => sum + q.answer, 0) / questions.length) : 0

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <Label htmlFor={props.id}>{label}</Label>
            <span>{averageScore}%</span>
          </div>
          <Slider {...props} value={[averageScore]} />
        </div>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          {rules.map((rule, index) => (
            <li key={index}>{rule}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

