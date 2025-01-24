import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

// GSAP ScrollTrigger 플러그인 등록
gsap.registerPlugin(ScrollTrigger)

export const useScrollTriggerAnimation = (messageId: string) => {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    // 초기 상태 설정
    gsap.set(element, {
      opacity: 0,
      y: 30,
      scale: 0.95,
    })

    // 스크롤 트리거 애니메이션 생성
    const animation = gsap.to(element, {
      scrollTrigger: {
        trigger: element,
        start: 'top bottom-=100', // 요소가 화면 하단에서 100px 위에 도달하면 시작
        end: 'top center', // 요소가 화면 중앙에 도달할 때까지
        toggleActions: 'play none none reverse', // 스크롤 다운: 실행, 스크롤 업: 되돌리기
        // markers: process.env.NODE_ENV === 'development', // 개발 환경에서만 마커 표시
      },
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: 'power2.out',
    })

    // 컴포넌트 언마운트 시 정리
    return () => {
      animation.scrollTrigger?.kill()
    }
  }, [messageId])

  return elementRef
}
