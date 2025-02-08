import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"

interface QuestionnaireProps {
  questions: { id: string; question: string }[]
  answers: Record<string, number>
  onAnswerChange: (id: string, value: number) => void
}

export function Questionnaire({ questions, answers, onAnswerChange }: QuestionnaireProps) {
  return (
    <div className="space-y-8">
      {questions.map((q, index) => (
        <div key={q.id}>
          <div className="space-y-4">
            <Label className="text-base leading-relaxed font-medium">{q.question}</Label>
            <RadioGroup
              value={answers[q.id]?.toString()}
              onValueChange={(value) => onAnswerChange(q.id, Number.parseInt(value, 10))}
              className="grid grid-cols-5 gap-2 pt-2"
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <div key={value} className="flex flex-col items-center gap-2">
                  <RadioGroupItem
                    value={value.toString()}
                    id={`${q.id}-${value}`}
                    className="h-5 w-5 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                  />
                  <Label
                    htmlFor={`${q.id}-${value}`}
                    className="text-sm font-normal cursor-pointer text-muted-foreground"
                  >
                    {value}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <div className="flex justify-between text-xs text-muted-foreground pt-1 px-1">
              <span>Strongly Disagree</span>
              <span>Strongly Agree</span>
            </div>
          </div>
          {index < questions.length - 1 && (
            <Separator className="mt-6" />
          )}
        </div>
      ))}
    </div>
  )
}

