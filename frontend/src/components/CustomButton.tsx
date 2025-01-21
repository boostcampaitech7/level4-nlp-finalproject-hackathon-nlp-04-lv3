import React from 'react';

type ButtonVariant = 'primary' | 'primary-2' | 'secondary' | 'secondary-2' | 'inverse';

interface CustomButtonProps {
  variant: ButtonVariant;
  children: React.ReactNode;
  onClick?: () => void;
  textColor?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({ 
  variant, 
  children, 
  onClick,
  textColor,
  leftIcon,
  rightIcon,
  className = ''
}) => {
  // variant에 따른 스타일 클래스 결정
  const getButtonClasses = (variant: ButtonVariant) => {
    const baseClasses = 'transition-colors duration-200 ease-in-out';
    const variantClasses = {
      'primary': 'bg-[var(--color-button-primary)] hover:bg-[var(--color-button-primary-hover)]',
      'primary-2': 'bg-[var(--color-button-primary-2)] hover:bg-[var(--color-button-primary-hover)]',
      'secondary': 'bg-[var(--color-button-secondary)] hover:bg-[var(--color-button-secondary-hover)]',
      'secondary-2': 'bg-[var(--color-button-secondary-2)] hover:bg-[var(--color-button-secondary-hover)]',
      'inverse': 'bg-[var(--color-button-inverse)] hover:opacity-80'
    }[variant];

    const textColorClass = textColor || {
      'primary': 'text-[var(--color-text-intermediate)]',
      'primary-2': 'text-[var(--color-text-intermediate)]',
      'secondary': 'text-[var(--color-text-secondary)]',
      'secondary-2': 'text-[var(--color-text-secondary)]',
      'inverse': 'text-[var(--color-text-inverse)]'
    }[variant];

    const paddingClass = {
      'primary': 'px-5 py-2',
      'primary-2': 'px-5 py-2',
      'secondary': 'px-2.5 py-[5px]',
      'secondary-2': 'px-2.5 py-[5px]',
      'inverse': 'px-4 py-2'
    }[variant];

    return `${baseClasses} ${variantClasses} ${textColorClass} ${paddingClass}`;
  };

  return (
    <button
      className={`
        ${getButtonClasses(variant)}
        rounded-2xl
        text-2xl font-semibold font-['Pretendard']
        flex items-center gap-2
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
