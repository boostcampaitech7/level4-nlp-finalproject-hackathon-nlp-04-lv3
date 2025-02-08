import { useState } from 'react'
import { VocabDetailType } from './types'

const ExplanationCarousel = ({ data }: { data: VocabDetailType }) => {
  // data.easy_explain은 설명 문자열들이 들어있는 배열입니다.
  const explanations = data.easy_explain
  const [currentIndex, setCurrentIndex] = useState(0)
  const total = explanations.length

  // 이전 항목으로 이동 (현재 첫 항목이면 동작하지 않음)
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1)
    }
  }

  // 다음 항목으로 이동 (현재 마지막 항목이면 동작하지 않음)
  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1)
    }
  }

  return (
    <div className="relative">
      {/* 카드 컨테이너 */}
      <div className="h-auto min-h-[363px] w-full min-w-[280px] max-w-[390px] overflow-hidden rounded-[32px] border-4 border-button-secondary-1 bg-surface-primary-2">
        <div className="flex h-full w-full flex-col">
          <div className="px-4 pb-4 pt-6 sm:px-8">
            <h3 className="mt-4 self-stretch text-text-primary body-l">
              쉬운 설명
            </h3>
          </div>
          <div className="relative z-10 flex w-full flex-grow flex-col items-start px-4 sm:px-8">
            <div className="self-stretch tracking-tight text-text-primary body-s">
              {explanations[currentIndex]}
            </div>
          </div>
        </div>
      </div>

      {/* 좌우 네비게이션 버튼 */}
      <button
        onClick={handlePrev}
        disabled={currentIndex === 0}
        className={`absolute left-0 top-1/2 z-20 -translate-y-1/2 transform rounded-full bg-gray-200 p-2 shadow-md ${
          currentIndex === 0 ? 'cursor-not-allowed opacity-50' : ''
        }`}
        aria-label="Previous explanation"
      >
        &lt;
      </button>
      <button
        onClick={handleNext}
        disabled={currentIndex === total - 1}
        className={`absolute right-0 top-1/2 z-20 -translate-y-1/2 transform rounded-full bg-gray-200 p-2 shadow-md ${
          currentIndex === total - 1 ? 'cursor-not-allowed opacity-50' : ''
        }`}
        aria-label="Next explanation"
      >
        &gt;
      </button>
    </div>
  )
}

export default ExplanationCarousel
