import React from 'react';

type ButtonVariant = 'primary' | 'primary-2' | 'secondary' | 'secondary-2' | 'inverse';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ButtonTypography = 'button-s' | 'button-m' | 'button-l' | 'body-s' | 'body-m' | 'body-l';

interface CustomButtonProps {
  variant: ButtonVariant;
  size?: ButtonSize;
  typography?: ButtonTypography;
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
  typography,
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

    // 크기별 패딩
    const sizeClasses = {
      'xs': variant.startsWith('secondary') ? 'px-2 py-1' : 'px-4 py-1',
      'sm': variant.startsWith('secondary') ? 'px-2 py-1.5' : 'px-5 py-1.5',
      'md': variant.startsWith('secondary') ? 'px-2.5 py-1' : 'px-4 py-2',
      'lg': variant.startsWith('secondary') ? 'px-4 py-1' : 'px-5 py-2',
      'xl': variant.startsWith('secondary') ? 'px-3 py-1.5' : 'px-7 py-2',
    }[size];

    // 사이즈별 기본 타이포그래피 (typography prop이 없을 경우 사용)
    const defaultTypography = {
      'xs': 'button-s',
      'sm': 'button-s',
      'md': 'button-m',
      'lg': 'button-m',
      'xl': 'button-l',
    }[size] as ButtonTypography;

    const typographyClass = typography || defaultTypography;
    const widthClass = fullWidth ? 'w-full' : '';

    return `${baseClasses} ${variantClasses} ${textColorClass} ${sizeClasses} ${typographyClass} ${widthClass}`;
  };

  return (
    <button
      className={`
        ${getButtonClasses(variant, size)}
        rounded-2xl
        flex items-center justify-center
        ${className}
      `}
      onClick={onClick}
    >
      {leftIcon ? (
        <span className="inline-flex items-center">{leftIcon}</span>
      ) : (
        rightIcon && <span className="w-2" />
      )}
      <span className={`${(leftIcon || rightIcon) ? 'mx-1' : ''}`}>{children}</span>
      {rightIcon ? (
        <span className="inline-flex items-center">{rightIcon}</span>
      ) : (
        leftIcon && <span className="w-2" />
      )}
    </button>
  );
};

export default CustomButton;
