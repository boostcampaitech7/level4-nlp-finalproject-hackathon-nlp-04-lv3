import { useState } from 'react'
import { VocabDetailType } from './types'
import { Button } from 'components'
import { motion, AnimatePresence } from 'framer-motion'

const ExplanationCarousel = ({ data }: { data: VocabDetailType }) => {
  // data.easy_explain은 설명 문자열들이 들어있는 배열입니다.
  const explanations = data.easy_explain
  const [currentIndex, setCurrentIndex] = useState(0)
  const total = explanations.length
  const [direction, setDirection] = useState(0)

  // 이전 항목으로 이동 (현재 첫 항목이면 동작하지 않음)
  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1)
      setCurrentIndex((prevIndex) => prevIndex - 1)
    }
  }

  // 다음 항목으로 이동 (현재 마지막 항목이면 동작하지 않음)
  const handleNext = () => {
    if (currentIndex < total - 1) {
      setDirection(1)
      setCurrentIndex((prevIndex) => prevIndex + 1)
    }
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  }

  return (
    <div className="flex h-[363px] w-full min-w-[280px] max-w-[390px] flex-col gap-y-[20px] rounded-[32px] border-4 border-button-secondary-1 bg-surface-primary-2 px-4 pb-[15px] pt-[30px] sm:px-4">
      <h3 className="self-stretch px-4 text-text-primary body-l">쉬운 설명</h3>
      <div className="custom-scrollbar-small z-10 w-full grow self-stretch overflow-y-auto overflow-x-hidden px-4">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="shrink grow basis-0 self-stretch text-text-primary body-s"
          >
            {explanations[currentIndex]}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="z-10 flex justify-end gap-2">
        <Button
          size="small"
          color="grey"
          text="이전"
          showBackIcon={true}
          disabled={currentIndex === 0}
          onClick={handlePrev}
          plusClasses={`px-[10px] ${currentIndex === 0 ? 'opacity-50' : ''}`}
        />
        <Button
          size="small"
          color="grey"
          text="다음"
          showFrontIcon={true}
          disabled={currentIndex === total - 1}
          onClick={handleNext}
          plusClasses={`px-[10px] ${currentIndex === total - 1 ? 'opacity-50' : ''}`}
        />
      </div>
    </div>
  )
}

export default ExplanationCarousel
