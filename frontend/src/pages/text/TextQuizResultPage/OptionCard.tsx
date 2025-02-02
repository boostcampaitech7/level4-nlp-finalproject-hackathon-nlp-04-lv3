interface OptionProps {
  text: string
  size?: 'small' | 'medium' | 'large' | 'xsmall'
  color?:
    | 'purple'
    | 'grey'
    | 'white'
    | 'black'
    | 'orange'
    | 'purple2'
    | 'blue'
    | 'red'
  showFrontIcon?: boolean
  showBackIcon?: boolean
  alignCenter?: boolean
  plusClasses?: string
}

const OptionCard = ({
  text,
  size = 'medium',
  color = 'purple',
  alignCenter = true,
  plusClasses = '',
}: OptionProps) => {
  const baseStyles = `inline-flex items-center content-center ${alignCenter ? 'justify-center' : 'justify-start'} transition-all duration-200 px-[10px] py-[5px] gap-x-[3px] m-0 select-none`

  const sizeStyles = {
    xsmall: 'button-s min-w-[106px] min-h-[25px] rounded-[12px]',
    small: 'button-m min-w-[106px] min-h-[39px] rounded-[16px]',
    medium: 'title-s h-[64px] rounded-[20px]',
    large: 'button-l w-[510px] h-[79px] rounded-[20px]',
  }

  const colorStyles = {
    purple: 'bg-button-primary-2 text-surface-primary-2',
    grey: 'bg-button-secondary-1 text-text-secondary',
    white: 'bg-surface-secondary text-text-intermidiate',
    black: 'bg-button-inverse text-text-inverse',
    orange: 'bg-orange-400 text-text-secondary',
    purple2: 'bg-purple-700 text-text-secondary',
    blue: 'bg-accent-blue text-text-inverse',
    red: 'bg-accent-red-2 text-text-inverse',
  }

  const buttonStyles = `${baseStyles} ${sizeStyles[size]} ${colorStyles[color]} ${plusClasses}`
  return (
    <div className={buttonStyles}>
      <span className="w-[3px]"></span>
      <div className={`${size === 'large' ? 'flex-1' : 'w-fit'} text-start`}>
        {text}
      </div>
      <span className="w-[3px]"></span>
    </div>
  )
}

export default OptionCard
