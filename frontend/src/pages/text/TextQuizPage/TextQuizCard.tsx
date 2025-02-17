import Button from 'components/Button'
import { useQuizUserAnswerStore } from 'stores/quizUserAnswerStore'

interface TextQuizProps {
  questionIdx: number
  question: string
  options: string[]
}

const TextQuizCard = ({ questionIdx, question, options }: TextQuizProps) => {
  const { quizSolve, setAnswer } = useQuizUserAnswerStore()

  const changeAnswer = (answer: number) => {
    if (quizSolve.userAnswer[questionIdx] === answer) {
      setAnswer(questionIdx, -1)
    } else {
      setAnswer(questionIdx, answer)
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
              color={`${quizSolve.userAnswer[questionIdx] === index + 1 ? 'purple' : 'white'}`}
              size="xsmall"
              alignCenter={false}
              onClick={() => changeAnswer(index + 1)}
            />
          )
        })}
      </div>
    </div>
  )
}

export default TextQuizCard
