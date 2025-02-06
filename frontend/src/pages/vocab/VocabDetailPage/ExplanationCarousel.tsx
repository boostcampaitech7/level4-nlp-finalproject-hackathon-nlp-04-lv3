import React, { useState } from 'react';

const ExplanationCarousel = ({ data }) => {
  // data.easy_explain은 설명 문자열들이 들어있는 배열입니다.
  const explanations = data.easy_explain;
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = explanations.length;

  // 이전 항목으로 이동 (현재 첫 항목이면 동작하지 않음)
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
    }
  };

  // 다음 항목으로 이동 (현재 마지막 항목이면 동작하지 않음)
  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
  };

  return (
    <div className="relative">
      {/* 카드 컨테이너 */}
      <div className="w-full max-w-[390px] min-w-[280px] h-auto min-h-[363px] bg-surface-primary-2 rounded-[32px] border-4 border-button-secondary-1 overflow-hidden">
        <div className="w-full h-full flex flex-col">
          <div className="px-4 sm:px-8 pt-6 pb-4">
            <h3 className="mt-4 self-stretch text-text-primary body-l">쉬운 설명</h3>
          </div>
          <div className="relative z-10 flex flex-col items-start px-4 sm:px-8 w-full flex-grow">
            <div className="self-stretch text-text-primary body-s tracking-tight">
              {explanations[currentIndex]}
            </div>
          </div>
        </div>
      </div>

      {/* 좌우 네비게이션 버튼 */}
      <button
        onClick={handlePrev}
        disabled={currentIndex === 0}
        className={`absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md z-20 ${
          currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        aria-label="Previous explanation"
      >
        &lt;
      </button>
      <button
        onClick={handleNext}
        disabled={currentIndex === total - 1}
        className={`absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md z-20 ${
          currentIndex === total - 1 ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        aria-label="Next explanation"
      >
        &gt;
      </button>
    </div>
  );
};

export default ExplanationCarousel;
