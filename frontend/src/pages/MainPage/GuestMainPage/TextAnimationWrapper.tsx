import { useRef } from 'react'
import { useTextAnimation } from '../../../hooks/useTextAnimation'

interface TextAnimationWrapperProps {
  children: React.ReactNode
  textSelector: string
  /**
   * Configuration options for the animation, as accepted by `useTextAnimation`.
   * If not provided, defaults to `defaultConfig`.
   */
  config?: Parameters<typeof useTextAnimation>[2]
  className?: string
}

const TextAnimationWrapper = ({
  children,
  textSelector,
  config,
  className = '',
}: TextAnimationWrapperProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  useTextAnimation(containerRef, textSelector, config)

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}

export default TextAnimationWrapper
