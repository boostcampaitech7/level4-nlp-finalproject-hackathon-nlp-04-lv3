import { IconType } from 'react-icons'

interface IconButtonProps {
  icon: IconType
  text: string
  size?: 'small' | 'medium' | 'large'
  color?: 'grey' | 'red' | 'blue'
  onClick: React.MouseEventHandler<HTMLButtonElement>
}

const IconButton = ({
  icon: Icon,
  text,
  size = 'medium',
  color = 'grey',
  onClick,
}: IconButtonProps) => {
  const baseStyles =
    'w-full inline-flex items-center transition-all duration-200 m-0 select-none leading-none px-3 py-2.5'

  const sizeStyles = {
    small: 'button-m gap-x-[20px] rounded-[12px]',
    medium: 'button-l gap-x-[30px] rounded-[16px]',
    large: 'headline-m gap-x-[40px] rounded-[20px]',
  }

  const colorStyles = {
    grey: 'text-text-secondary hover:text-text-intermediate hover:bg-button-secondary-hover',
    red: 'text-red-400 hover:text-red-200 hover:bg-button-secondary-hover',
    blue: 'text-blue-200 hover:text-blue-100 hover:bg-button-secondary-hover',
  }

  const iconSize = {
    small: 22,
    medium: 28,
    large: 32,
  }

  const buttonStyles = `${baseStyles} ${sizeStyles[size]} ${colorStyles[color]}`
  return (
    <button className={buttonStyles} onClick={onClick}>
      <Icon size={iconSize[size]} />
      <span>{text}</span>
    </button>
  )
}

export default IconButton
