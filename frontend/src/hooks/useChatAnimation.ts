import { useEffect, useRef } from 'react';
import gsap from 'gsap';

// 각 메시지 사이의 딜레이 시간 (초)
const MESSAGE_DELAY = 0.3;

export const useChatAnimation = (messageId: string, index: number) => {
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = messageRef.current;
    if (element) {
      // 초기 상태 설정
      gsap.set(element, {
        opacity: 0,
        y: 30,
        scale: 0.8
      });

      // 애니메이션 실행 (인덱스에 따른 딜레이 적용)
      gsap.to(element, {
        duration: 0.6,
        opacity: 1,
        y: 0,
        scale: 1,
        ease: "back.out(1.7)",
        delay: index * MESSAGE_DELAY
      });
    }
  }, [messageId, index]);

  return messageRef;
};
