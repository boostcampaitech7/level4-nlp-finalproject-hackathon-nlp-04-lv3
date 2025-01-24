import { useEffect, RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ImageAnimationConfig {
  duration?: number
  x?: number
  scale?: number
  opacity?: number
  ease?: string
  delay?: number
  scrollTrigger?: {
    start?: string
    end?: string
    toggleActions?: string
  }
}

const defaultConfig: ImageAnimationConfig = {
  duration: 1.2,
  x: 100,
  scale: 0.7,
  opacity: 0,
  ease: 'power2.out',
  delay: 0.2,
  scrollTrigger: {
    start: 'top center+=100',
    end: 'bottom center',
    toggleActions: 'play none none reverse',
  },
}

export const useImageAnimation = (
  containerRef: RefObject<HTMLElement>,
  imageSelector: string,
  config: ImageAnimationConfig = {},
) => {
  useEffect(() => {
    if (!containerRef.current) return

    const mergedConfig = {
      ...defaultConfig,
      ...config,
      scrollTrigger: {
        ...defaultConfig.scrollTrigger,
        ...config.scrollTrigger,
      },
    }

    const imageElements = containerRef.current.querySelectorAll(imageSelector)

    // 초기 상태 설정
    gsap.set(imageElements, {
      x: mergedConfig.x,
      scale: mergedConfig.scale,
      opacity: 0,
    })

    // 애니메이션 적용
    gsap.to(imageElements, {
      x: 0,
      scale: 1,
      opacity: 1,
      duration: mergedConfig.duration,
      ease: mergedConfig.ease,
      delay: mergedConfig.delay,
      scrollTrigger: {
        trigger: containerRef.current,
        ...mergedConfig.scrollTrigger,
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [containerRef, imageSelector, config])
}
