import { CardAnimationConfig } from '../hooks/useCardAnimation'

// 애니메이션 프리셋 타입
export type AnimationPreset =
  | 'fanOut'
  | 'stack'
  | 'cascade'
  | 'spiral'
  | 'shuffle'
  | 'fadeUp'

// 프리셋 설정들
export const animationPresets: Record<AnimationPreset, CardAnimationConfig> = {
  // 아래에서 위로 페이드인되며 나타나는 애니메이션
  fadeUp: {
    initialX: 0,
    initialY: 50,
    initialRotation: 0,
    spacing: {
      x: 0,
      y: 0,
      rotation: 0,
    },
    duration: 0.8,
    stagger: 0.2,
  },

  // 부채꼴 모양으로 펼쳐지는 애니메이션
  fanOut: {
    initialX: -150,
    initialY: 0,
    initialRotation: -45,
    spacing: {
      x: 25,
      y: 0,
      rotation: 15,
    },
    duration: 1,
    stagger: 0.05,
  },

  // 카드가 쌓이는 듯한 애니메이션
  stack: {
    initialX: 0,
    initialY: -50,
    initialRotation: 0,
    spacing: {
      x: 5,
      y: 10,
      rotation: 3,
    },
    duration: 0.8,
    stagger: 0.1,
  },

  // 폭포수처럼 떨어지는 애니메이션
  cascade: {
    initialX: 0,
    initialY: -200,
    initialRotation: 0,
    spacing: {
      x: 0,
      y: 30,
      rotation: 0,
    },
    duration: 1.2,
    stagger: 0.15,
    ease: 'bounce.out',
  },

  // 나선형으로 펼쳐지는 애니메이션
  spiral: {
    initialX: 0,
    initialY: 0,
    initialRotation: 0,
    spacing: {
      x: 30,
      y: 30,
      rotation: 45,
    },
    duration: 1.5,
    stagger: 0.1,
    ease: 'power2.out',
  },

  // 카드가 섞이는 듯한 애니메이션
  shuffle: {
    initialX: 0,
    initialY: 0,
    initialRotation: 180,
    spacing: {
      x: 20,
      y: 0,
      rotation: -180,
    },
    duration: 0.8,
    stagger: 0.08,
    ease: 'power1.out',
  },
}
