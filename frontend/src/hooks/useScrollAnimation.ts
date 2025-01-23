import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export const useScrollAnimation = (messageId: string) => {
  const elementRef = useRef<HTMLDivElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    // 초기 상태를 투명하게 설정
    gsap.set(element, {
      opacity: 0,
      y: 20,
      scale: 0.95,
    })

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return

        // 이미 애니메이션이 실행됐다면 무시
        if (hasAnimated) return

        if (entry.isIntersecting) {
          setHasAnimated(true)

          gsap.to(element, {
            duration: 0.5,
            opacity: 1,
            y: 0,
            scale: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: element,
              start: 'top bottom-=100',
              toggleActions: 'play none none reverse',
            },
          })
        }
      },
      {
        threshold: 0.3, // 30% 이상 보여야 애니메이션 시작
        rootMargin: '0px', // 정확한 스크롤 위치에서 트리거
      },
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [messageId, hasAnimated])

  return elementRef
}
