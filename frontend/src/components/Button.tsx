import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'

interface ButtonProps {
  text: string
  size?: 'small' | 'medium' | 'large' | 'xsmall'
  color?: 'purple' | 'grey' | 'white' | 'black' | 'orange' | 'purple2'
  showFrontIcon?: boolean
  showBackIcon?: boolean
  onClick: React.MouseEventHandler<HTMLButtonElement>
  plusClasses?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const Button = ({
  text,
  size = 'medium',
  color = 'purple',
  showFrontIcon = false,
  showBackIcon = false,
  onClick,
  plusClasses = '',
  disabled = false,
  type = 'button',
}: ButtonProps) => {
  const baseStyles =
    'inline-flex items-center content-center justify-center transition-all duration-200 px-[10px] py-[5px] gap-x-[3px] m-0 select-none'

  const sizeStyles = {
    xsmall: 'button-s min-w-[106px] h-[25px] rounded-[12px]',
    small: 'button-m min-w-[106px] h-[39px] rounded-[16px]',
    medium: 'title-s h-[64px] rounded-[20px]',
    large: 'button-l w-[510px] h-[79px] rounded-[20px]',
  }
  const iconSize = {
    xsmall: 16,
    small: 22,
    medium: 32,
    large: 32,
  }
  const colorStyles = {
    purple: 'bg-button-primary-2 text-surface-primary-2',
    grey: 'bg-button-secondary-1 text-text-secondary',
    white: 'bg-surface-secondary text-text-intermidiate',
    black: 'bg-button-inverse text-text-inverse',
    orange: 'bg-orange-400 text-text-secondary',
    purple2: 'bg-purple-700 text-text-secondary',
  }

  const hoverColorStyles = {
    purple: 'hover:bg-button-primary-hover-1 hover:text-surface-secondary',
    grey: 'hover:bg-button-secondary-hover hover:text-text-intermediate',
    white: 'hover:bg-button-secondary-hover',
    black: 'hover:bg-text-secondary',
    orange: 'hover:bg-orange-400 hover:text-text-secondary',
    purple2: 'hover:bg-purple-700 hover:text-text-secondary',
  }

  const buttonStyles = `${baseStyles} ${sizeStyles[size]} ${colorStyles[color]} ${hoverColorStyles[color]} ${plusClasses} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`

  return (
    <button className={buttonStyles} onClick={onClick} disabled={disabled} type={type}>
      {showBackIcon && <FaChevronLeft size={iconSize[size]} />}
      <span className="w-[3px]"></span>
      <div className={`${size === 'large' ? 'flex-1' : 'w-fit'} text-center`}>
        {text}
      </div>
      <span className="w-[3px]"></span>
      {showFrontIcon && <FaChevronRight size={iconSize[size]} />}
    </button>
  )
}

export default Button
