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
    <div className="flex min-w-[345px] flex-col gap-y-[16px] rounded-[32px] bg-white-1 px-[20px] py-[15px]">
      <div className="font-bold body-s">{`${questionIdx + 1}. ${question}`}</div>
      <div className="flex flex-col gap-y-[10px]">
        {options.map((option, index) => {
          return (
            <OptionCard
              key={index}
              text={`${index + 1}. ${option}`}
              color={`${index + 1 === answer ? 'blue' : index + 1 === userAnswer && !correct ? 'red' : 'white'}`}
              size="xsmall"
              alignCenter={false}
            />
          )
        })}
      </div>
      <div className="whitespace-pre-line button-s">
        <span className="text-accent-blue">{`정답: ${answer}`}</span>
        {`\n설명: ${answerExplain}`}
      </div>
    </div>
  )
}

export default TextQuizResultCard
