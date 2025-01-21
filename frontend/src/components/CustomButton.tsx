import React from 'react';

type ButtonVariant = 'primary' | 'primary-2' | 'secondary' | 'secondary-2' | 'inverse';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface CustomButtonProps {
  variant: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  onClick?: () => void;
  textColor?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({ 
  variant, 
  size = 'md',
  children, 
  onClick,
  textColor,
  leftIcon,
  rightIcon,
  className = '',
  fullWidth = false,
}) => {
  // variant에 따른 스타일 클래스 결정
  const getButtonClasses = (variant: ButtonVariant, size: ButtonSize) => {
    const baseClasses = 'transition-colors duration-200 ease-in-out';
    
    // 배경색 및 호버 효과
    const variantClasses = {
      'primary': 'bg-[var(--color-button-primary)] hover:bg-[var(--color-button-primary-hover)]',
      'primary-2': 'bg-[var(--color-button-primary-2)] hover:bg-[var(--color-button-primary-hover)]',
      'secondary': 'bg-[var(--color-button-secondary)] hover:bg-[var(--color-button-secondary-hover)]',
      'secondary-2': 'bg-[var(--color-button-secondary-2)] hover:bg-[var(--color-button-secondary-hover)]',
      'inverse': 'bg-[var(--color-button-inverse)] hover:opacity-80'
    }[variant];

    // 텍스트 색상
    const textColorClass = textColor || {
      'primary': 'text-[var(--color-text-intermediate)]',
      'primary-2': 'text-[var(--color-text-intermediate)]',
      'secondary': 'text-[var(--color-text-intermediate)]',
      'secondary-2': 'text-[var(--color-text-intermediate)]',
      'inverse': 'text-[var(--color-text-inverse)]'
    }[variant];

    // 크기별 패딩과 텍스트 크기
    const sizeClasses = {
      'xs': {
        padding: variant.startsWith('secondary') ? 'px-2 py-1' : 'px-3 py-1',
        text: 'text-sm'
      },
      'sm': {
        padding: variant.startsWith('secondary') ? 'px-2 py-1.5' : 'px-4 py-1.5',
        text: 'text-base'
      },
      'md': {
        padding: variant.startsWith('secondary') ? 'px-2.5 py-[5px]' : 'px-4 py-2',
        text: 'text-lg'
      },
      'lg': {
        padding: variant.startsWith('secondary') ? 'px-3 py-2' : 'px-5 py-2.5',
        text: 'text-xl'
      },
      'xl': {
        padding: variant.startsWith('secondary') ? 'px-4 py-2.5' : 'px-6 py-3',
        text: 'text-2xl'
      }
    }[size];

    const widthClass = fullWidth ? 'w-full' : '';

    return `${baseClasses} ${variantClasses} ${textColorClass} ${sizeClasses.padding} ${sizeClasses.text} ${widthClass}`;
  };

  return (
    <button
      className={`
        ${getButtonClasses(variant, size)}
        rounded-2xl
        font-semibold font-['Pretendard']
        flex items-center justify-center gap-2
        ${className}
      `}
      onClick={onClick}
    >
      {leftIcon && <span className="inline-flex items-center">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="inline-flex items-center">{rightIcon}</span>}
    </button>
  );
};

export default CustomButton;
