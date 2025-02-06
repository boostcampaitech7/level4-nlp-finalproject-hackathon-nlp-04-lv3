import OptionCard from './OptionCard'

interface TextQuizSolveProps {
  questionIdx: number
  question: string
  options: string[]
  answer: number
  answerExplain: string
  userAnswer: number
  correct: boolean
}

const TextQuizResultCard = ({
  questionIdx,
  question,
  options,
  answer,
  answerExplain,
  userAnswer,
  correct,
}: TextQuizSolveProps) => {
  return (
    <div className="flex w-[345px] flex-col gap-y-[16px] rounded-[32px] bg-white-1 px-[20px] py-[15px]">
      <div className="font-bold body-s">{`${questionIdx + 1}. ${question}`}</div>
      <div className="flex flex-col gap-y-[10px]">
        {options.map((option, index) => {
          return (
            <OptionCard
              key={index}
              text={option}
              isAnswer={answer === index + 1}
              isUserAnswer={userAnswer === index + 1}
              correct={correct}
            />
          )
        })}
      </div>
      <div className="whitespace-pre-line button-s">
        <span className="text-accent-blue">{`정답: ${answer}`}</span>
        <span className="text-text-secondary">{` (나의 선택: ${userAnswer})`}</span>
        {`\n설명: ${answerExplain}`}
      </div>
    </div>
  )
}

export default TextQuizResultCard
