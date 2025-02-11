import { useRef } from 'react'
import { useImageAnimation } from '../../../hooks/useImageAnimation'

interface ImageAnimationWrapperProps {
  children: React.ReactNode
  imageSelector: string
  config?: Parameters<typeof useImageAnimation>[2]
  className?: string
}

const ImageAnimationWrapper = ({
  children,
  imageSelector,
  config,
  className = '',
}: ImageAnimationWrapperProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  useImageAnimation(containerRef, imageSelector, config)

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}

export default ImageAnimationWrapper
