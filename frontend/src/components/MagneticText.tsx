import { useEffect, useRef } from 'react'

interface MagneticTextProps {
  children: React.ReactNode
  className?: string
}

const MagneticText = ({ children, className = '' }: MagneticTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const text = container.innerText

    // 각 글자를 span으로 감싸기 (공백 포함)
    container.innerHTML = Array.from(text)
      .map((char) => {
        if (char === ' ') {
          return '<span style="opacity: 1; display: inline-block; transition: opacity 0.15s ease-out;">&nbsp;</span>'
        }
        return `<span style="opacity: 1; display: inline-block; transition: opacity 0.15s ease-out;">${char}</span>`
      })
      .join('')

    const spans = Array.from(container.getElementsByTagName('span'))

    const updateSpans = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      spans.forEach((span) => {
        const spanRect = span.getBoundingClientRect()
        const spanCenterX = spanRect.left - rect.left + spanRect.width / 2
        const spanCenterY = spanRect.top - rect.top + spanRect.height / 2

        const distance = Math.sqrt(
          Math.pow(mouseX - spanCenterX, 2) + Math.pow(mouseY - spanCenterY, 2),
        )

        // 거리 계산을 위한 상수
        const RADIUS = 50 // 밝은 영역의 반경
        const MIN_OPACITY = 0.1 // 가장 어두운 상태
        const MAX_OPACITY = 1 // 가장 밝은 상태

        // 거리에 따른 투명도를 지수 함수로 계산
        let opacity
        if (distance <= RADIUS) {
          // 반경 내부: 거의 완전히 보임
          opacity = MAX_OPACITY
        } else {
          // 반경 외부: 거리에 따라 급격히 어두워짐
          const normalizedDistance = (distance - RADIUS) / RADIUS
          opacity = Math.max(
            MIN_OPACITY,
            MAX_OPACITY * Math.exp(-normalizedDistance * 2),
          )
        }

        span.style.opacity = opacity.toString()
      })
    }

    const handleMouseEnter = () => {
      spans.forEach((span) => {
        span.style.opacity = '0.1'
      })
    }

    const handleMouseLeave = () => {
      spans.forEach((span) => {
        span.style.opacity = '1'
      })
    }

    container.addEventListener('mousemove', updateSpans)
    container.addEventListener('mouseenter', handleMouseEnter)
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      container.removeEventListener('mousemove', updateSpans)
      container.removeEventListener('mouseenter', handleMouseEnter)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ cursor: 'default' }}
    >
      {children}
    </div>
  )
}

export default MagneticText
