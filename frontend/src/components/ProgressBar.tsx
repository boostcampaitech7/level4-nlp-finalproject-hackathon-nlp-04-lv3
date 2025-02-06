import React from 'react'

interface ProgressBarProps {
  total: number
  current: number
  onClick?: (index: number) => void
  highlightColor?: string
  baseColor?: string
  className?: string
  interactive?: boolean
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  total,
  current,
  onClick,
  highlightColor = 'bg-accent-highlight',
  baseColor = 'bg-background-primary',
  className = '',
  interactive = true
}) => {
  return (
    <div className={`self-stretch w-full px-[29px] py-[20px] justify-center items-end gap-[5px] inline-flex ${className}`}>
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          className={`grow shrink basis-0 h-[9px] rounded-[32px] transition-transform duration-200 transform origin-bottom
            ${interactive ? 'hover:scale-y-150 cursor-pointer' : ''}
            ${current === index
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
