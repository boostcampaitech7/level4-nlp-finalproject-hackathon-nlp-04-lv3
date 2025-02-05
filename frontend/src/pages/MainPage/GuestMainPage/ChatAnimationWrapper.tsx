import React, { useLayoutEffect, useRef, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

// ScrollTrigger 플러그인 등록
gsap.registerPlugin(ScrollTrigger)

interface ChatAnimationWrapperProps {
  children: React.ReactNode
  className?: string
}

export const ChatAnimationWrapper: React.FC<ChatAnimationWrapperProps> = ({
  children,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  const setupAnimation = () => {
    const el = containerRef.current
    if (!el) return

    // 이전 타임라인이 있다면 정리
    if (timelineRef.current) {
      timelineRef.current.kill()
    }

    // 초기 상태 설정
    gsap.set(el, { 
      opacity: 0, 
      y: 50,
      scale: 0.95
    })

    // 새로운 타임라인 생성
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top bottom-=100',
        end: 'top center',
        toggleActions: 'play none none reverse',
      }
    })

    tl.to(el, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: 'power2.out',
    })

    timelineRef.current = tl
  }

  // 초기 애니메이션 설정
  useLayoutEffect(() => {
    setupAnimation()
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [])

  // 모달 상태 변경 감지
  useEffect(() => {
    const handleModalChange = () => {
      // ScrollTrigger 재계산
      ScrollTrigger.refresh()
      // 애니메이션 재설정
      setupAnimation()
    }

    // dialog 요소의 변경을 감지
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.target.nodeName === 'DIALOG') {
          setTimeout(handleModalChange, 100) // 약간의 지연을 두어 DOM이 완전히 업데이트되도록 함
          break
        }
      }
    })

    // dialog 요소만 관찰
    const dialogs = document.querySelectorAll('dialog')
    dialogs.forEach(dialog => {
      observer.observe(dialog, {
        attributes: true,
        attributeFilter: ['open']
      })
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div ref={containerRef} className={`will-change-transform ${className}`}>
      {children}
    </div>
  )
}
