import { FaCheck } from 'react-icons/fa'

interface OptionProps {
  text: string
  isAnswer: boolean
  isUserAnswer: boolean
  correct: boolean
}

const OptionCard = ({ text, isAnswer, isUserAnswer, correct }: OptionProps) => {
  const baseStyles = `inline-flex items-center content-center justify-start transition-all duration-200 px-[10px] py-[5px] gap-x-[3px] m-0 select-none`

  const sizeStyles = 'button-s min-w-[106px] min-h-[25px] rounded-[12px]'

  const colorStyles = isAnswer
    ? 'bg-accent-blue text-text-inverse'
    : 'bg-surface-secondary text-text-intermidiate'

  const finalStyles = `${baseStyles} ${sizeStyles} ${colorStyles}`
  return (
    <div className={finalStyles}>
      {isUserAnswer && (
        <FaCheck
          className={`${correct ? 'text-accent-highlight' : 'text-red-100'}`}
        />
      )}
      <span className="w-[3px]"></span>
      <div className="w-fit text-start">{text}</div>
      <span className="w-[3px]"></span>
    </div>
  )
}

export default OptionCard
