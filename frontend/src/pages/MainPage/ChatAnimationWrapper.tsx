import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

// ScrollTrigger 플러그인 등록
gsap.registerPlugin(ScrollTrigger);

interface ChatAnimationWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const ChatAnimationWrapper: React.FC<ChatAnimationWrapperProps> = ({
  children,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    // 사용자의 reduced motion 설정 확인
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    const element = containerRef.current;
    if (!element) return;

    // 초기 상태 설정 (reduced motion이 활성화되어 있으면 투명도만 적용)
    gsap.set(element, {
      opacity: 0,
      ...(prefersReducedMotion ? {} : {
        scale: 0.9,
        y: 50
      })
    });

    // GSAP Context 생성
    const ctx = gsap.context(() => {
      // 기본 애니메이션 설정
      const animation = {
        opacity: 1,
        duration: prefersReducedMotion ? 0.3 : 0.8,
        ease: "power2.out",
        clearProps: "all", // 애니메이션 완료 후 인라인 스타일 제거
      };

      // reduced motion이 비활성화된 경우에만 추가 애니메이션 적용
      if (!prefersReducedMotion) {
        Object.assign(animation, {
          scale: 1,
          y: 0
        });
      }

      // 모바일 기기 확인
      const isMobile = window.innerWidth <= 768;

      // ScrollTrigger 설정
      const scrollTrigger = {
        trigger: element,
        start: isMobile ? "top bottom" : "top bottom-=100", // 모바일에서는 더 일찍 시작
        end: "top center",
        toggleActions: "play none none reverse",
        // 모바일에서는 더 가벼운 스크롤 계산
        fastScrollEnd: true,
        preventOverlaps: true
      };

      // 애니메이션 적용
      gsap.to(element, {
        ...animation,
        scrollTrigger
      });
    });

    // Context 저장
    animationRef.current = ctx;

    // Cleanup 함수
    return () => {
      if (animationRef.current) {
        animationRef.current.revert();
        animationRef.current = null;
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={className}
      // 접근성을 위한 ARIA 속성 추가
      aria-live="polite"
      aria-atomic="true"
    >
      {children}
    </div>
  );
};
