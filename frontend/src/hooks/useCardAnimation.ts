import { useEffect, RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface CardAnimationConfig {
  initialX?: number;
  initialY?: number;
  initialRotation?: number;
  initialScale?: number;
  spacing?: {
    x?: number;
    y?: number;
    rotation?: number;
  };
  duration?: number;
  stagger?: number;
  ease?: string;
  scrollTrigger?: {
    start?: string;
    end?: string;
    toggleActions?: string;
  };
}

const defaultConfig: CardAnimationConfig = {
  initialX: -100,
  initialY: 0,
  initialRotation: -25,
  initialScale: 0.8,
  spacing: {
    x: 25,
    y: 0,
    rotation: 15,
  },
  duration: 1,
  stagger: 0.05,
  ease: 'power2.out',
  scrollTrigger: {
    start: 'top center+=100',
    end: 'bottom center',
    toggleActions: 'play none none reverse',
  },
};

export const useCardAnimation = (
  containerRef: RefObject<HTMLElement>,
  cardSelector: string,
  config: CardAnimationConfig = {}
) => {
  useEffect(() => {
    if (!containerRef.current) return;

    const mergedConfig = {
      ...defaultConfig,
      ...config,
      spacing: { ...defaultConfig.spacing, ...config.spacing },
      scrollTrigger: { ...defaultConfig.scrollTrigger, ...config.scrollTrigger },
    };

    const cardElements = containerRef.current.querySelectorAll(cardSelector);

    // 초기 설정
    gsap.set(cardElements, {
      x: mergedConfig.initialX,
      y: mergedConfig.initialY,
      rotation: mergedConfig.initialRotation,
      scale: mergedConfig.initialScale,
      opacity: 0,
      transformOrigin: 'center center',
    });

    // 애니메이션 적용
    cardElements.forEach((card, index) => {
      const rotation = (mergedConfig.initialRotation || 0) + 
        (index * (mergedConfig.spacing?.rotation || 0));

      gsap.to(card, {
        opacity: 1,
        scale: 1,
        rotation,
        x: (mergedConfig.initialX || 0) + (index * (mergedConfig.spacing?.x || 0)),
        y: (mergedConfig.initialY || 0) + (index * (mergedConfig.spacing?.y || 0)),
        duration: mergedConfig.duration,
        delay: index * (mergedConfig.stagger || 0),
        ease: mergedConfig.ease,
        scrollTrigger: {
          trigger: containerRef.current,
          ...mergedConfig.scrollTrigger,
        },
      });
    });

    // 클린업
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [containerRef, cardSelector, config]);
};
