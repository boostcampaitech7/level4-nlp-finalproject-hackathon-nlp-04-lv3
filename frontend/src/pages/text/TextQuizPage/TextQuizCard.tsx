import Button from 'components/Button'
import { useTextQuizSolveStore } from 'stores/textQuizSolveStore'

interface TextQuizProps {
  questionIdx: number
  question: string
  options: string[]
}

const TextQuizCard = ({ questionIdx, question, options }: TextQuizProps) => {
  const { userAnswer, setAnswer } = useTextQuizSolveStore()

  const handleClickOption = (optionIdx: number) => {
    if (userAnswer[questionIdx] === optionIdx) {
      setAnswer(questionIdx, -1)
    } else {
      setAnswer(questionIdx, optionIdx)
    }
  }

  return (
    <div className="flex min-w-[345px] flex-col gap-y-[16px] rounded-[32px] bg-white-1 px-[20px] py-[15px]">
      <div className="font-bold body-s">{question}</div>
      <div className="flex flex-col gap-y-[10px]">
        {options.map((option, index) => {
          return (
            <Button
              key={index}
              text={option}
              color={`${userAnswer[questionIdx] === index ? 'purple' : 'white'}`}
              size="xsmall"
              alignCenter={false}
              onClick={() => handleClickOption(index)}
            />
          )
        })}
      </div>
    </div>
  )
}

export default TextQuizCard
