import { useEffect, RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TextAnimationConfig {
  stagger?: number;
  duration?: number;
  x?: number;
  y?: number;
  opacity?: number;
  ease?: string;
  scrollTrigger?: {
    start?: string;
    end?: string;
    toggleActions?: string;
  };
}

const defaultConfig: TextAnimationConfig = {
  stagger: 0.2,
  duration: 1,
  x: 0,
  y: 0,
  opacity: 0,
  ease: 'power2.out',
  scrollTrigger: {
    start: 'top center+=100',
    end: 'bottom center',
    toggleActions: 'play none none reverse',
  },
};

export const useTextAnimation = (
  containerRef: RefObject<HTMLElement>,
  textSelector: string,
  config: TextAnimationConfig = {}
) => {
  useEffect(() => {
    if (!containerRef.current) return;

    const mergedConfig = {
      ...defaultConfig,
      ...config,
      scrollTrigger: { ...defaultConfig.scrollTrigger, ...config.scrollTrigger },
    };

    const textElements = containerRef.current.querySelectorAll(textSelector);

    // 초기 상태 설정
    gsap.set(textElements, {
      x: mergedConfig.x,
      y: mergedConfig.y,
      opacity: 0,
    });

    // 애니메이션 적용
    gsap.to(textElements, {
      x: 0,
      y: 0,
      opacity: 1,
      duration: mergedConfig.duration,
      stagger: mergedConfig.stagger,
      ease: mergedConfig.ease,
      scrollTrigger: {
        trigger: containerRef.current,
        ...mergedConfig.scrollTrigger,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [containerRef, textSelector, config]);
};
