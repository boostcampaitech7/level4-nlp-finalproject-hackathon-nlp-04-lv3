import { IconType } from 'react-icons'

interface IconButtonProps {
  icon: IconType
  text: string
  size?: 'small' | 'medium' | 'large'
  onClick: React.MouseEventHandler<HTMLButtonElement>
}

const IconButton = ({
  icon: Icon,
  text,
  size = 'medium',
  onClick,
}: IconButtonProps) => {
  const baseStyles =
    'inline-flex items-center content-center justify-center transition-all duration-200 m-0 select-none leading-none px-2.5 py-2'

  const sizeStyles = {
    small: 'button-m gap-x-[20px]',
    medium: 'button-l gap-x-[30px]',
    large: 'headline-m gap-x-[40px]',
  }

  const iconSize = {
    small: 22,
    medium: 28,
    large: 32,
  }

  const buttonStyles = `${baseStyles} ${sizeStyles[size]}`
  return (
    <button className={buttonStyles} onClick={onClick}>
      <Icon size={iconSize[size]} />
      <span>{text}</span>
    </button>
  )
}

export default IconButton
