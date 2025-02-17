interface ProgressBarProps {
  total: number
  current: number
  onClick?: (index: number) => void
  highlightColor?: string
  baseColor?: string
  className?: string
  interactive?: boolean
}

const ProgressBar = ({
  total,
  current,
  onClick,
  highlightColor = 'bg-accent-highlight',
  baseColor = 'bg-background-primary',
  className = '',
  interactive = true,
}: ProgressBarProps) => {
  return (
    <div
      className={`inline-flex w-full items-end justify-center gap-[5px] self-stretch px-[29px] py-[20px] ${className}`}
    >
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          className={`h-[9px] shrink grow basis-0 origin-bottom transform rounded-[32px] transition-transform duration-200 ${interactive ? 'cursor-pointer hover:scale-y-150' : ''} ${
            current === index
              ? `${highlightColor} scale-y-110`
              : `${baseColor} ${interactive ? `hover:${highlightColor}` : ''}`
          }`}
          onClick={() => interactive && onClick?.(index)}
          aria-label={`문제 ${index + 1}`}
          disabled={!interactive}
        />
      ))}
    </div>
  )
}

export default ProgressBar
