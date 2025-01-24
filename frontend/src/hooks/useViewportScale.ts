import { useState, useEffect } from 'react'

interface ViewportScale {
  scale: number
  translateX: number
  translateY: number
}

export const useViewportScale = (
  targetWidth: number = 1920,
  targetHeight: number = 1080,
  minScale: number = 0.5,
  maxScale: number = 1,
): ViewportScale => {
  const [scale, setScale] = useState<ViewportScale>({
    scale: 1,
    translateX: 0,
    translateY: 0,
  })

  useEffect(() => {
    const calculateScale = () => {
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight

      // 가로, 세로 비율 중 더 작은 값을 기준으로 스케일 계산
      const scaleX = windowWidth / targetWidth
      const scaleY = windowHeight / targetHeight
      let newScale = Math.min(scaleX, scaleY)

      // 최소, 최대 스케일 제한
      newScale = Math.max(minScale, Math.min(maxScale, newScale))

      // 중앙 정렬을 위한 translate 값 계산
      const translateX = (windowWidth - targetWidth * newScale) / 2
      const translateY = (windowHeight - targetHeight * newScale) / 2

      setScale({
        scale: newScale,
        translateX,
        translateY,
      })
    }

    // 초기 계산
    calculateScale()

    // 리사이즈 이벤트 리스너 등록
    window.addEventListener('resize', calculateScale)

    // 클린업 함수
    return () => {
      window.removeEventListener('resize', calculateScale)
    }
  }, [targetWidth, targetHeight, minScale, maxScale])

  return scale
}
