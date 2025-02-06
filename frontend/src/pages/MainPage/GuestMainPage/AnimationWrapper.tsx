import React, { useRef } from 'react'
import { useCardAnimation } from '../../../hooks/useCardAnimation'
import { AnimationPreset, animationPresets } from '../../../animations/presets'

interface AnimationWrapperProps {
  children: React.ReactNode
  cardSelector: string
  preset?: AnimationPreset
  config?: Parameters<typeof useCardAnimation>[2]
  className?: string
}

export const AnimationWrapper: React.FC<AnimationWrapperProps> = ({
  children,
  cardSelector,
  preset = 'fanOut',
  config = {},
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  // 프리셋과 커스텀 설정을 병합
  const finalConfig = {
    ...animationPresets[preset],
    ...config,
    spacing: {
      ...animationPresets[preset].spacing,
      ...config.spacing,
    },
  }

  useCardAnimation(containerRef, cardSelector, finalConfig)

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}
